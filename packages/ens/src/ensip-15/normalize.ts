// https://docs.ens.domains/ensip/15
//
// ENSIP-15 name normalization. Walks the input through:
//   1. tokenize    — recognize emoji + classify cps
//                    (mapped / ignored / valid / disallowed)
//   2. nfc         — normalize each label's text cps
//   3. validate    — apply per-label structural rules and
//                    script-group consistency
//
// Data tables come from `./data/spec`, derived from the
// ENSIP-15 reference data by `./derive/spec`.

import {
  array,
  type InferOutput,
  literal,
  number,
  object,
  pipe,
  readonly,
  variant,
} from "valibot"

import {
  ALL_CM,
  EMOJI,
  FENCED,
  GROUPS,
  type Group,
  IGNORED,
  MAPPED,
  NSM,
  NSM_MAX,
  WHOLES,
} from "./data/spec"
import { from_cps, nfc, nfd, to_cps } from "./nfc"

const STOP = 0x2e
const FE0F = 0xfe0f
const UNDERSCORE = 0x5f

// ---------------------------------------------- tables

const IGNORED_SET: ReadonlySet<number> = new Set(IGNORED)
const NSM_SET: ReadonlySet<number> = new Set(NSM)
const CM_SET: ReadonlySet<number> = new Set(ALL_CM)
const MAPPED_MAP: ReadonlyMap<number, readonly number[]> =
  new Map(MAPPED.map(([cp, repl]) => [cp, repl]))
const FENCED_MAP: ReadonlyMap<number, string> = new Map(
  FENCED.map(([cp, name]) => [cp, name]),
)

// Union of every group's primary + secondary + cm. Used
// to decide if a cp is "valid text" before we worry about
// which group it belongs to.
const ALL_VALID: ReadonlySet<number> = (() => {
  const s = new Set<number>()
  for (const g of GROUPS) {
    for (const cp of g.primary) s.add(cp)
    for (const cp of g.secondary) s.add(cp)
    for (const cp of g.cm) s.add(cp)
  }
  return s
})()

// Per-group membership lookups. The raw arrays in spec.ts
// are huge (Han primary ≈ 90k cps) — O(n) `includes` calls
// dominate validation, so we mirror them as Sets once at
// module load. `group_sets` is a closure-bound lookup with
// a lazy fallback: every group in GROUPS is pre-seeded, and
// any unseen-but-valid Group falls through to a fresh build
// (no undefined leakage, so no cast).
const group_sets = (() => {
  const cache = new WeakMap<
    Group,
    {
      primary: ReadonlySet<number>
      secondary: ReadonlySet<number>
    }
  >()
  for (const g of GROUPS) {
    cache.set(g, {
      primary: new Set(g.primary),
      secondary: new Set(g.secondary),
    })
  }
  return (g: Group) => {
    const cached = cache.get(g)
    if (cached) return cached
    const fresh = {
      primary: new Set(g.primary),
      secondary: new Set(g.secondary),
    }
    cache.set(g, fresh)
    return fresh
  }
})()

function group_has_cp(_group: Group, _cp: number): boolean {
  const sets = group_sets(_group)
  return sets.primary.has(_cp) || sets.secondary.has(_cp)
}

// Inverted index: cp → groups that contain it. Built once
// to keep the WHOLES preprocessing below O(members ×
// groups-per-cp) instead of O(members × all groups ×
// primary/secondary sizes).
const CP_TO_GROUPS: ReadonlyMap<number, readonly Group[]> =
  (() => {
    const m = new Map<number, Group[]>()
    for (const g of GROUPS) {
      for (const cp of g.primary) {
        let list = m.get(cp)
        if (list === undefined) {
          list = []
          m.set(cp, list)
        }
        list.push(g)
      }
      for (const cp of g.secondary) {
        let list = m.get(cp)
        if (list === undefined) {
          list = []
          m.set(cp, list)
        }
        list.push(g)
      }
    }
    return m
  })()

// ---------------------------------------------- wholes
//
// ENSIP-15 §4 "Whole-Script Confusables". Each WHOLES
// entry carries a `target` label, the `valid` cps that
// belong to that target in its native group, and the
// `confused` cps from OTHER groups that look like the
// target. A label is rejected as a whole-script confusable
// if every non-mark cp could equally belong to some other
// single group than the label's own.
//
// We follow the @adraffy/ens-normalize.js precompute:
//   1. Split each whole's (valid + confused) cps into
//      "recs" keyed by which groups they live in.
//   2. For each rec, compute the complement = the union of
//      every OTHER rec's groups within the same whole.
//   3. Register each confused-only cp in WHOLE_MAP →
//      complement. cps that appear as `valid` in any whole
//      are "shared" (WHOLE_VALID) and skipped — they don't
//      narrow a confusable target on their own.

const WHOLE_VALID: ReadonlySet<number> = (() => {
  const s = new Set<number>()
  for (const w of WHOLES) {
    for (const cp of w.valid) s.add(cp)
  }
  return s
})()

const ALL_WHOLE_MEMBERS: ReadonlySet<number> = (() => {
  const s = new Set<number>()
  for (const w of WHOLES) {
    for (const cp of w.valid) s.add(cp)
    for (const cp of w.confused) s.add(cp)
  }
  return s
})()

// "Unique anchors" — cps that appear in exactly one group
// and are NOT part of any whole-confusable set. Seeing one
// of these in a label proves the label can't be a whole
// confusable with another script: it pins the script
// unambiguously. @adraffy stores these in WHOLE_MAP under
// a UNIQUE_PH sentinel; we keep it as a separate Set for
// type clarity.
const WHOLE_UNIQUE: ReadonlySet<number> = (() => {
  const counts = new Map<number, number>()
  for (const g of GROUPS) {
    for (const cp of g.primary) {
      counts.set(cp, (counts.get(cp) ?? 0) + 1)
    }
    for (const cp of g.secondary) {
      counts.set(cp, (counts.get(cp) ?? 0) + 1)
    }
  }
  const s = new Set<number>()
  for (const [cp, n] of counts) {
    if (n === 1 && !ALL_WHOLE_MEMBERS.has(cp)) s.add(cp)
  }
  return s
})()

// cp → set of groups that COULD claim this cp as their own
// in a confusable swap. Lookups go directly from cp to its
// complement set; the prior `complement_by_cp` indirection
// inside a `WholeProc` was dead weight (every consumer
// looked up the same cp it used to index WHOLE_MAP).
const WHOLE_MAP: ReadonlyMap<
  number,
  ReadonlySet<Group>
> = (() => {
  const out = new Map<number, ReadonlySet<Group>>()
  for (const w of WHOLES) {
    const members: number[] = [...w.valid, ...w.confused]
    const recs: Array<{
      groups: Set<Group>
      cps: number[]
    }> = []
    for (const cp of members) {
      const gs = CP_TO_GROUPS.get(cp) ?? []
      let rec = recs.find((r) =>
        gs.some((g) => r.groups.has(g)),
      )
      if (rec === undefined) {
        rec = { groups: new Set(), cps: [] }
        recs.push(rec)
      }
      rec.cps.push(cp)
      for (const g of gs) rec.groups.add(g)
    }
    const union_groups = new Set<Group>()
    for (const r of recs)
      for (const g of r.groups) union_groups.add(g)
    for (const r of recs) {
      const complement = new Set<Group>()
      for (const g of union_groups) {
        if (!r.groups.has(g)) complement.add(g)
      }
      for (const cp of r.cps) {
        if (WHOLE_VALID.has(cp)) continue
        out.set(cp, complement)
      }
    }
  }
  return out
})()

function check_whole(
  _group: Group,
  _text: readonly number[],
  _label_repr: string,
): void {
  // Dedup at the call site keeps the maker-intersection
  // logic order-independent (per the @adraffy comment, the
  // unique-cp set suffices for single-char confusables).
  const seen = new Set<number>()
  const unique: number[] = []
  for (const cp of _text) {
    if (!seen.has(cp)) {
      seen.add(cp)
      unique.push(cp)
    }
  }
  let maker: Set<Group> | null = null
  const shared: number[] = []
  for (const cp of unique) {
    // Anchors: a cp that lives in exactly one group and in
    // no whole pins the label to that group — no whole
    // confusable can apply, return early.
    if (WHOLE_UNIQUE.has(cp)) return
    const candidates = WHOLE_MAP.get(cp)
    if (candidates !== undefined) {
      if (maker === null) {
        maker = new Set(candidates)
      } else {
        const next = new Set<Group>()
        for (const g of maker) {
          if (candidates.has(g)) next.add(g)
        }
        maker = next
      }
      if (maker.size === 0) return
    } else {
      shared.push(cp)
    }
  }
  if (maker === null) return
  for (const g of maker) {
    if (g === _group) continue
    if (shared.every((cp) => group_has_cp(g, cp))) {
      throw new Error(
        `label "${_label_repr}" whole-script confusable: ${_group.name}/${g.name}`,
      )
    }
  }
}

// ---------------------------------------------- emoji

// Trie node. Keys are cps with FE0F omitted (we strip
// FE0F from both spec entries and input when matching).
// `canonical` holds the spec entry verbatim (with FE0F)
// for the longest sequence ending at this node.
// Recursive trie node — Valibot's `lazy()` would need a hand-rolled
// type to break the inference cycle (same Valibot-docs pattern as
// `abiInputSchema`). Kept as a type alias.
type Node = {
  children: Map<number, Node>
  canonical: readonly number[] | null
}

function new_node(): Node {
  return { children: new Map(), canonical: null }
}

const EMOJI_ROOT: Node = (() => {
  const root = new_node()
  for (const seq of EMOJI) {
    let node = root
    for (const cp of seq) {
      if (cp === FE0F) continue
      let next = node.children.get(cp)
      if (next === undefined) {
        next = new_node()
        node.children.set(cp, next)
      }
      node = next
    }
    node.canonical = seq
  }
  return root
})()

const emojiMatchSchema = object({
  canonical: pipe(array(number()), readonly()),
  consumed: number(),
})
type EmojiMatch = InferOutput<typeof emojiMatchSchema>

function match_emoji(
  _cps: readonly number[],
  _pos: number,
): EmojiMatch | null {
  let node: Node = EMOJI_ROOT
  let last_match: EmojiMatch | null = null
  let consumed = 0
  for (const cp of _cps.slice(_pos)) {
    if (cp === FE0F) {
      // FE0F is consumed at any point but doesn't advance
      // the trie. The spec entry may or may not include
      // it at this position — we accept either form.
      consumed++
      if (node.canonical !== null) {
        last_match = { canonical: node.canonical, consumed }
      }
      continue
    }
    const child = node.children.get(cp)
    if (child === undefined) break
    node = child
    consumed++
    if (node.canonical !== null) {
      last_match = { canonical: node.canonical, consumed }
    }
  }
  return last_match
}

// ---------------------------------------------- tokens

const textTokenSchema = object({
  kind: literal("text"),
  cps: array(number()),
})
type TextToken = InferOutput<typeof textTokenSchema>

const emojiTokenSchema = object({
  kind: literal("emoji"),
  cps: pipe(array(number()), readonly()),
})
type EmojiToken = InferOutput<typeof emojiTokenSchema>

const stopTokenSchema = object({ kind: literal("stop") })

const tokenSchema = variant("kind", [
  textTokenSchema,
  emojiTokenSchema,
  stopTokenSchema,
])
type Token = InferOutput<typeof tokenSchema>

function tokenize(_cps: readonly number[]): Token[] {
  const out: Token[] = []
  let buf: number[] = []
  const flush = () => {
    if (buf.length > 0) {
      out.push({ kind: "text", cps: buf })
      buf = []
    }
  }
  let i = 0
  while (i < _cps.length) {
    const emoji = match_emoji(_cps, i)
    if (emoji !== null) {
      flush()
      out.push({ kind: "emoji", cps: emoji.canonical })
      i += emoji.consumed
      continue
    }
    const cp = _cps[i]
    if (cp === undefined) break
    i++
    if (cp === STOP) {
      flush()
      out.push({ kind: "stop" })
      continue
    }
    if (IGNORED_SET.has(cp)) continue
    const mapped = MAPPED_MAP.get(cp)
    if (mapped !== undefined) {
      // A mapping may emit STOP — split here.
      for (const m of mapped) {
        if (m === STOP) {
          flush()
          out.push({ kind: "stop" })
        } else if (IGNORED_SET.has(m)) {
          // unlikely but mapped→ignored is technically
          // possible; drop silently
        } else {
          buf.push(m)
        }
      }
      continue
    }
    if (ALL_VALID.has(cp)) {
      buf.push(cp)
      continue
    }
    throw new Error(
      `disallowed code point U+${cp
        .toString(16)
        .toUpperCase()
        .padStart(4, "0")}`,
    )
  }
  flush()
  return out
}

// ---------------------------------------------- labels

type Label = (TextToken | EmojiToken)[]

function split_labels(_tokens: Token[]): Label[] {
  const out: Label[] = []
  let current: Label = []
  for (const tok of _tokens) {
    if (tok.kind === "stop") {
      out.push(current)
      current = []
    } else {
      current.push(tok)
    }
  }
  out.push(current)
  return out
}

function apply_nfc_to_label(_label: Label): Label {
  return _label.map((tok) => {
    if (tok.kind !== "text") return tok
    return { kind: "text", cps: nfc(tok.cps) }
  })
}

// Flat list of every cp in the label, in order, including
// emoji cps inline. Used only for "is it pure ASCII" check.
function flatten_label(_label: Label): number[] {
  const out: number[] = []
  for (const tok of _label) {
    for (const cp of tok.cps) out.push(cp)
  }
  return out
}

// All text cps (no emoji). Used for fenced / underscore /
// NSM checks and for the script-group check.
function text_cps_of(_label: Label): number[] {
  const out: number[] = []
  for (const tok of _label) {
    if (tok.kind === "text") {
      for (const cp of tok.cps) out.push(cp)
    }
  }
  return out
}

// ---------------------------------------------- rules

function check_fenced(
  _text: number[],
  _label_repr: string,
): void {
  const [first, ...rest] = _text
  if (first === undefined) return
  if (FENCED_MAP.has(first)) {
    throw new Error(
      `label "${_label_repr}" starts with fenced ${FENCED_MAP.get(first)}`,
    )
  }
  const last = _text.at(-1)
  if (last !== undefined && FENCED_MAP.has(last)) {
    throw new Error(
      `label "${_label_repr}" ends with fenced ${FENCED_MAP.get(last)}`,
    )
  }
  // Sliding-window over the remainder; `first` is known
  // non-fenced (we threw above) so seeding `prev = first`
  // can't yield a false positive on the first iteration.
  let prev = first
  for (const cp of rest) {
    if (FENCED_MAP.has(cp) && FENCED_MAP.has(prev)) {
      throw new Error(
        `label "${_label_repr}" has consecutive fenced chars`,
      )
    }
    prev = cp
  }
}

function check_leading_underscore(
  _text: number[],
  _label_repr: string,
): void {
  // ENSIP-15: underscores are only allowed at the start of
  // the label (any number of leading underscores).
  let seen_non_underscore = false
  for (const cp of _text) {
    if (cp === UNDERSCORE) {
      if (seen_non_underscore) {
        throw new Error(
          `label "${_label_repr}" has underscore in non-leading position`,
        )
      }
    } else {
      seen_non_underscore = true
    }
  }
}

function check_nsm_runs(
  _text: number[],
  _label_repr: string,
): void {
  // The NSM count is over the NFD-expanded form: a
  // precomposed character like إ decomposes to ا + a
  // hamza-below NSM, and the hidden NSM counts toward
  // the run.
  const expanded = nfd(_text)
  let run = 0
  const seen_in_run = new Set<number>()
  for (const cp of expanded) {
    if (NSM_SET.has(cp)) {
      run++
      if (run > NSM_MAX) {
        throw new Error(
          `label "${_label_repr}" has more than ${NSM_MAX} consecutive non-spacing marks`,
        )
      }
      if (seen_in_run.has(cp)) {
        throw new Error(
          `label "${_label_repr}" has duplicate non-spacing mark`,
        )
      }
      seen_in_run.add(cp)
    } else {
      run = 0
      seen_in_run.clear()
    }
  }
}

function check_label_extension(
  _text: number[],
  _label_repr: string,
): void {
  // ENSIP-15: labels must not have hyphen-minus at both
  // positions 3 and 4 (the IDNA "label extension" guard).
  if (
    _text.length >= 4 &&
    _text[2] === 0x2d &&
    _text[3] === 0x2d
  ) {
    throw new Error(
      `label "${_label_repr}" has hyphens at positions 3,4`,
    )
  }
}

function check_combining_marks(
  _label: Label,
  _label_repr: string,
): void {
  // A combining mark may not begin a label and may not
  // come immediately after an emoji.
  let prev_was_emoji = false
  for (const [i, tok] of _label.entries()) {
    if (tok.kind === "text") {
      const [first] = tok.cps
      if (first === undefined) {
        prev_was_emoji = false
        continue
      }
      if (CM_SET.has(first)) {
        if (i === 0) {
          throw new Error(
            `label "${_label_repr}" begins with combining mark`,
          )
        }
        if (prev_was_emoji) {
          throw new Error(
            `label "${_label_repr}" has combining mark after emoji`,
          )
        }
      }
      prev_was_emoji = false
    } else {
      prev_was_emoji = true
    }
  }
}

function group_contains_all(
  _group: Group,
  _text: readonly number[],
): boolean {
  const sets = group_sets(_group)
  for (const cp of _text) {
    if (!sets.primary.has(cp) && !sets.secondary.has(cp)) {
      return false
    }
  }
  return true
}

function group_primary_contains_all(
  _group: Group,
  _text: readonly number[],
): boolean {
  const sets = group_sets(_group)
  for (const cp of _text) {
    if (!sets.primary.has(cp)) return false
  }
  return true
}

function determine_group(
  _text: number[],
  _label_repr: string,
): Group {
  // Narrow by *every* text cp, CMs included. CMs that
  // belong to a different script (e.g. Hebrew U+0307 in
  // a Latin label, "i̇hsan") naturally eliminate the wrong
  // group. CMs that genuinely belong to the script live in
  // its `primary`, so the right group survives. This also
  // disambiguates shared digits — "१𑠲" combines a digit
  // in {Devanagari, Dogr, Kthi, Mahj} with a Dogra-only CM,
  // and narrowing collapses to Dogr.
  //
  // Three passes, early return. Avoids materializing an
  // intermediate `candidates: Group[]` array — and avoids
  // the `candidates[0]` indexed-access nag.
  //
  //   1. unrestricted, primary-only fit (best match)
  //   2. unrestricted, primary∪secondary fit
  //   3. restricted, primary-only fit
  //   4. restricted, primary∪secondary fit
  //
  // Tier 2 is only reached if no unrestricted has a primary
  // fit; tier 3/4 are only reached if no unrestricted fits at
  // all — matching the original narrow_candidates(unrestricted)
  // → narrow_candidates(restricted) cascade.
  let any_unrestricted_fits = false
  for (const g of GROUPS) {
    if (g.restricted) continue
    if (group_primary_contains_all(g, _text)) return g
    if (
      !any_unrestricted_fits &&
      group_contains_all(g, _text)
    ) {
      any_unrestricted_fits = true
    }
  }
  if (any_unrestricted_fits) {
    for (const g of GROUPS) {
      if (g.restricted) continue
      if (group_contains_all(g, _text)) return g
    }
  }
  for (const g of GROUPS) {
    if (!g.restricted) continue
    if (group_primary_contains_all(g, _text)) return g
  }
  for (const g of GROUPS) {
    if (!g.restricted) continue
    if (group_contains_all(g, _text)) return g
  }
  throw new Error(
    `label "${_label_repr}" mixes scripts (no single group contains all cps)`,
  )
}

function check_group_cm(
  _group: Group,
  _text: number[],
  _label_repr: string,
): void {
  // Redundant after the determine_group change above —
  // narrow_candidates already constrains the chosen group
  // to one whose primary/secondary contains every cp in
  // the label, CMs included. Kept as a defensive check for
  // any future drift in determine_group, plus the
  // per-group `cm` whitelist remains the authoritative
  // restriction if a group declares one.
  if (_group.cm.length === 0) return
  const allowed = new Set(_group.cm)
  for (const cp of _text) {
    if (CM_SET.has(cp) && !allowed.has(cp)) {
      throw new Error(
        `label "${_label_repr}" has cm U+${cp
          .toString(16)
          .toUpperCase()
          .padStart(4, "0")} not in group ${_group.name}`,
      )
    }
  }
}

function classify_label_kind(
  _label: Label,
  _flat: number[],
): "ascii" | "emoji" | "text" {
  const has_emoji = _label.some((t) => t.kind === "emoji")
  const has_non_ascii_text = _label.some(
    (t) =>
      t.kind === "text" && t.cps.some((cp) => cp > 0x7f),
  )
  if (!has_emoji && !has_non_ascii_text) return "ascii"
  if (
    _label.every(
      (t) =>
        t.kind === "emoji" ||
        (t.kind === "text" && t.cps.length === 0),
    )
  ) {
    return "emoji"
  }
  if (has_non_ascii_text) return "text"
  // Mix of ASCII text + emoji → treat as text label for
  // the script-group check (ASCII-only group exists).
  return "text"
}

function validate_label(_label: Label): void {
  const flat = flatten_label(_label)
  const text = text_cps_of(_label)
  const label_repr = from_cps(flat)

  if (flat.length === 0) {
    throw new Error("empty label")
  }

  // Structural checks apply to all label kinds. Fenced
  // applies to the flattened label (so emoji at the
  // edges "shield" an adjacent fenced char from being
  // first/last).
  check_combining_marks(_label, label_repr)
  check_fenced(flat, label_repr)
  // Underscore is leading-only across the WHOLE label —
  // emoji preceding it disqualifies (e.g. "👁_👁").
  check_leading_underscore(flat, label_repr)
  if (text.length > 0) {
    check_nsm_runs(text, label_repr)
  }

  const kind = classify_label_kind(_label, flat)
  if (kind === "ascii") {
    check_label_extension(text, label_repr)
    return
  }
  if (kind === "emoji") return

  const group = determine_group(text, label_repr)
  check_group_cm(group, text, label_repr)
  check_whole(group, text, label_repr)
}

// ---------------------------------------------- top-level

function emit_labels(
  _labels: Label[],
  _with_fe0f: boolean,
): string {
  return _labels
    .map((label) =>
      from_cps(
        label.flatMap((t) => {
          if (t.kind === "emoji" && !_with_fe0f) {
            return Array.from(t.cps).filter(
              (cp) => cp !== FE0F,
            )
          }
          return Array.from(t.cps)
        }),
      ),
    )
    .join(".")
}

// `ens_normalize` returns the canonical, deterministic
// form used for namehash — emoji are emitted WITHOUT the
// FE0F variation selectors that the spec entries carry.
export function ens_normalize(_name: string): string {
  if (_name.length === 0) return ""
  const cps = to_cps(_name)
  const tokens = tokenize(cps)
  const labels = split_labels(tokens).map(
    apply_nfc_to_label,
  )
  for (const label of labels) validate_label(label)
  return emit_labels(labels, false)
}

// `ens_beautify` returns the display form — same labels,
// but emoji keep their FE0F so rendering picks emoji
// presentation. Use for UI, not for hashing.
export function ens_beautify(_name: string): string {
  if (_name.length === 0) return ""
  const cps = to_cps(_name)
  const tokens = tokenize(cps)
  const labels = split_labels(tokens).map(
    apply_nfc_to_label,
  )
  for (const label of labels) validate_label(label)
  return emit_labels(labels, true)
}
