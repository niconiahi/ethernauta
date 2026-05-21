// https://www.unicode.org/reports/tr15/
//
// Canonical decomposition (NFD) and composition (NFC).
// Data tables come from `./data/nfc`, derived from the
// Unicode UCD by `./derive/nfc`.

import {
  CCC_DATA,
  COMP_DATA,
  DECOMP_DATA,
} from "./data/nfc"

// ---------------------------------------------- Hangul

const S_BASE = 0xac00
const L_BASE = 0x1100
const V_BASE = 0x1161
const T_BASE = 0x11a7
const L_COUNT = 19
const V_COUNT = 21
const T_COUNT = 28
const N_COUNT = V_COUNT * T_COUNT // 588
const S_COUNT = L_COUNT * N_COUNT // 11172
const S_END = S_BASE + S_COUNT
const L_END = L_BASE + L_COUNT
const V_END = V_BASE + V_COUNT
const T_END = T_BASE + T_COUNT

// ---------------------------------------------- tables

const CCC: ReadonlyMap<number, number> = (() => {
  const m = new Map<number, number>()
  for (let i = 0; i < CCC_DATA.length; i += 2) {
    m.set(CCC_DATA[i] as number, CCC_DATA[i + 1] as number)
  }
  return m
})()

const DECOMP: ReadonlyMap<number, readonly number[]> =
  (() => {
    const m = new Map<number, readonly number[]>()
    let i = 0
    while (i < DECOMP_DATA.length) {
      const cp = DECOMP_DATA[i] as number
      const len = DECOMP_DATA[i + 1] as number
      const seq = DECOMP_DATA.slice(i + 2, i + 2 + len)
      m.set(cp, seq)
      i += 2 + len
    }
    return m
  })()

const COMP: ReadonlyMap<
  number,
  ReadonlyMap<number, number>
> = (() => {
  const outer = new Map<number, Map<number, number>>()
  for (let i = 0; i < COMP_DATA.length; i += 3) {
    const a = COMP_DATA[i] as number
    const b = COMP_DATA[i + 1] as number
    const c = COMP_DATA[i + 2] as number
    let inner = outer.get(a)
    if (inner === undefined) {
      inner = new Map<number, number>()
      outer.set(a, inner)
    }
    inner.set(b, c)
  }
  return outer
})()

// ---------------------------------------------- helpers

export function get_ccc(_cp: number): number {
  return CCC.get(_cp) ?? 0
}

export function to_cps(_s: string): number[] {
  const out: number[] = []
  for (let i = 0; i < _s.length; ) {
    const cp = _s.codePointAt(i) as number
    out.push(cp)
    i += cp > 0xffff ? 2 : 1
  }
  return out
}

export function from_cps(_cps: readonly number[]): string {
  let out = ""
  for (const cp of _cps) {
    out += String.fromCodePoint(cp)
  }
  return out
}

// ---------------------------------------------- NFD

function decompose_into(_cp: number, _out: number[]): void {
  if (_cp >= S_BASE && _cp < S_END) {
    const s_index = _cp - S_BASE
    const l = L_BASE + Math.floor(s_index / N_COUNT)
    const v =
      V_BASE + Math.floor((s_index % N_COUNT) / T_COUNT)
    const t = T_BASE + (s_index % T_COUNT)
    _out.push(l, v)
    if (t !== T_BASE) _out.push(t)
    return
  }
  const decomp = DECOMP.get(_cp)
  if (decomp === undefined) {
    _out.push(_cp)
    return
  }
  for (const sub of decomp) decompose_into(sub, _out)
}

function canonical_reorder(_cps: number[]): void {
  let i = 0
  while (i < _cps.length) {
    if (get_ccc(_cps[i] as number) === 0) {
      i++
      continue
    }
    let j = i + 1
    while (
      j < _cps.length &&
      get_ccc(_cps[j] as number) !== 0
    ) {
      j++
    }
    const slice = _cps.slice(i, j).map((cp, idx) => ({
      cp,
      ccc: get_ccc(cp),
      idx,
    }))
    slice.sort((a, b) => a.ccc - b.ccc || a.idx - b.idx)
    for (let k = 0; k < slice.length; k++) {
      _cps[i + k] = (slice[k] as { cp: number }).cp
    }
    i = j
  }
}

export function nfd(_cps: readonly number[]): number[] {
  const out: number[] = []
  for (const cp of _cps) decompose_into(cp, out)
  canonical_reorder(out)
  return out
}

// ---------------------------------------------- NFC

function compose_pair(_a: number, _b: number): number {
  // Hangul L + V → LV syllable
  if (
    _a >= L_BASE &&
    _a < L_END &&
    _b >= V_BASE &&
    _b < V_END
  ) {
    const l_index = _a - L_BASE
    const v_index = _b - V_BASE
    return S_BASE + (l_index * V_COUNT + v_index) * T_COUNT
  }
  // Hangul LV + T → LVT syllable
  if (
    _a >= S_BASE &&
    _a < S_END &&
    _b > T_BASE &&
    _b < T_END &&
    (_a - S_BASE) % T_COUNT === 0
  ) {
    return _a + (_b - T_BASE)
  }
  return COMP.get(_a)?.get(_b) ?? -1
}

export function nfc(_cps: readonly number[]): number[] {
  const decomposed = nfd(_cps)
  if (decomposed.length === 0) return []

  const out: number[] = []
  let starter_pos = -1
  let last_class = -1

  for (const cp of decomposed) {
    const cc = get_ccc(cp)
    if (starter_pos !== -1) {
      const can_try =
        cc === 0 ? last_class === 0 : last_class < cc
      if (can_try) {
        const composed = compose_pair(
          out[starter_pos] as number,
          cp,
        )
        if (composed !== -1) {
          out[starter_pos] = composed
          continue
        }
      }
    }
    out.push(cp)
    if (cc === 0) {
      starter_pos = out.length - 1
      last_class = 0
    } else {
      last_class = cc
    }
  }
  return out
}
