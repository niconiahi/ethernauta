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

// TODO(WHOLES): whole-script confusable detection is not
// yet implemented. The `WHOLES` table in ./data/spec
// flags labels that use chars from a single script that
// look like chars from another (e.g. "0х" — Cyrillic
// ха with an ASCII digit). Until WHOLES is wired up, this
// normaliser will accept some labels that ENSIP-15 would
// reject as confusable. ≈562/38614 of the official test
// suite (1.46%) exercises this path.

import {
  ALL_CM,
  EMOJI,
  FENCED,
  type Group,
  GROUPS,
  IGNORED,
  MAPPED,
  NSM,
  NSM_MAX,
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

// ---------------------------------------------- emoji

// Trie node. Keys are cps with FE0F omitted (we strip
// FE0F from both spec entries and input when matching).
// `canonical` holds the spec entry verbatim (with FE0F)
// for the longest sequence ending at this node.
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

type EmojiMatch = {
  canonical: readonly number[]
  consumed: number
}

function match_emoji(
  _cps: readonly number[],
  _pos: number,
): EmojiMatch | null {
  let node: Node | undefined = EMOJI_ROOT
  let last_match: EmojiMatch | null = null
  let i = _pos
  while (i < _cps.length && node !== undefined) {
    const cp = _cps[i] as number
    if (cp === FE0F) {
      // FE0F is consumed at any point but doesn't advance
      // the trie. The spec entry may or may not include
      // it at this position — we accept either form.
      i++
      if (node.canonical !== null) {
        last_match = {
          canonical: node.canonical,
          consumed: i - _pos,
        }
      }
      continue
    }
    const child: Node | undefined = node.children.get(cp)
    if (child === undefined) break
    node = child
    i++
    if (node.canonical !== null) {
      last_match = {
        canonical: node.canonical,
        consumed: i - _pos,
      }
    }
  }
  return last_match
}

// ---------------------------------------------- tokens

type TextToken = { kind: "text"; cps: number[] }
type EmojiToken = {
  kind: "emoji"
  cps: readonly number[]
}
type StopToken = { kind: "stop" }
type Token = TextToken | EmojiToken | StopToken

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
    const cp = _cps[i] as number
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
  if (_text.length === 0) return
  if (FENCED_MAP.has(_text[0] as number)) {
    throw new Error(
      `label "${_label_repr}" starts with fenced ${FENCED_MAP.get(_text[0] as number)}`,
    )
  }
  if (FENCED_MAP.has(_text[_text.length - 1] as number)) {
    throw new Error(
      `label "${_label_repr}" ends with fenced ${FENCED_MAP.get(_text[_text.length - 1] as number)}`,
    )
  }
  for (let i = 1; i < _text.length; i++) {
    if (
      FENCED_MAP.has(_text[i] as number) &&
      FENCED_MAP.has(_text[i - 1] as number)
    ) {
      throw new Error(
        `label "${_label_repr}" has consecutive fenced chars`,
      )
    }
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
  for (let i = 0; i < _label.length; i++) {
    const tok = _label[i] as TextToken | EmojiToken
    if (tok.kind === "text") {
      if (tok.cps.length === 0) {
        prev_was_emoji = false
        continue
      }
      const first = tok.cps[0] as number
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

function narrow_candidates(
  _initial: readonly Group[],
  _non_cm: readonly number[],
): Group[] {
  let candidates: Group[] = _initial.slice()
  for (const cp of _non_cm) {
    candidates = candidates.filter(
      (g) =>
        g.primary.includes(cp) ||
        g.secondary.includes(cp),
    )
    if (candidates.length === 0) break
  }
  return candidates
}

function determine_group(
  _text: number[],
  _label_repr: string,
): Group {
  const non_cm = _text.filter((cp) => !CM_SET.has(cp))
  // First try non-restricted groups (Latin, Greek, …).
  let candidates = narrow_candidates(
    GROUPS.filter((g) => !g.restricted),
    non_cm,
  )
  if (candidates.length === 0) {
    // Fall back to restricted groups (Brahmi, Cuneiform,
    // …). These are accepted but constrained to their
    // own primary set.
    candidates = narrow_candidates(
      GROUPS.filter((g) => g.restricted),
      non_cm,
    )
  }
  if (candidates.length === 0) {
    throw new Error(
      `label "${_label_repr}" mixes scripts (no single group contains all cps)`,
    )
  }
  // Prefer a group where every cp is in the primary set
  // (the strongest match).
  const primary_first = candidates.find((g) =>
    non_cm.every((cp) => g.primary.includes(cp)),
  )
  return primary_first ?? (candidates[0] as Group)
}

function check_group_cm(
  _group: Group,
  _text: number[],
  _label_repr: string,
): void {
  // If the group defines a CM whitelist, every CM in the
  // label must be in it. Otherwise any CM in ALL_CM is OK.
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
  if (text.length > 0) {
    check_leading_underscore(text, label_repr)
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
