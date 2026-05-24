import {
  boolean,
  type InferOutput,
  object,
  optional,
  parse,
  string,
} from "valibot"

import {
  type Description,
  DescriptionSchema,
} from "./abi/description"
import { typeSchema } from "./abi/shared"

// Parse a list of human-readable Solidity signatures into the canonical
// ABI JSON shape this package speaks (`Description`). Scope:
//   - `function name(type arg, ...) [pure|view|payable|nonpayable] [returns (...)]`
//   - `event Name(type [indexed] arg, ...)` (+ trailing `anonymous`)
//   - `error Name(type arg, ...)`
//   - `constructor(type arg, ...) [stateMutability]`
// Only primitive types from `typeSchema` are accepted. No tuples, no
// nested types. Hand-write JSON ABI for anything richer.
export function parse_abi(
  _signatures: readonly string[],
): Description[] {
  return _signatures.map(parse_signature)
}

function parse_signature(_sig: string): Description {
  const sig = _sig.trim()
  if (sig.startsWith("function "))
    return parse_function(sig)
  if (sig.startsWith("event ")) return parse_event(sig)
  if (sig.startsWith("error ")) return parse_error(sig)
  if (sig.startsWith("constructor"))
    return parse_constructor(sig)
  throw new Error(
    `parse_abi: unrecognised signature "${_sig}"`,
  )
}

function parse_function(_sig: string): Description {
  const after_kw = _sig.slice("function ".length)
  const name_end = after_kw.indexOf("(")
  if (name_end < 0) {
    throw new Error(`parse_abi: missing "(" in "${_sig}"`)
  }
  const name = after_kw.slice(0, name_end).trim()
  const { args, rest } = split_arglist(
    after_kw.slice(name_end),
  )
  const inputs = args.map((arg) => parse_arg(arg, false))
  let mutability = "nonpayable"
  let outputs: ReturnType<typeof parse_arg>[] = []
  let cursor = rest.trim()
  for (const m of [
    "pure",
    "view",
    "payable",
    "nonpayable",
  ] as const) {
    if (cursor.startsWith(m)) {
      mutability = m
      cursor = cursor.slice(m.length).trim()
      break
    }
  }
  if (cursor.startsWith("returns")) {
    cursor = cursor.slice("returns".length).trim()
    const { args: out_args, rest: tail } =
      split_arglist(cursor)
    outputs = out_args.map((arg) => parse_arg(arg, false))
    cursor = tail.trim()
  }
  if (cursor.length > 0) {
    throw new Error(
      `parse_abi: trailing tokens "${cursor}" in "${_sig}"`,
    )
  }
  return parse(DescriptionSchema, {
    type: "function",
    name,
    inputs: inputs.map(({ name: n, type }) => ({
      name: n,
      type,
    })),
    outputs: outputs.map(({ name: n, type }) => ({
      name: n,
      type,
    })),
    stateMutability: mutability,
  })
}

function parse_event(_sig: string): Description {
  const after_kw = _sig.slice("event ".length)
  const name_end = after_kw.indexOf("(")
  if (name_end < 0) {
    throw new Error(`parse_abi: missing "(" in "${_sig}"`)
  }
  const name = after_kw.slice(0, name_end).trim()
  const { args, rest } = split_arglist(
    after_kw.slice(name_end),
  )
  const inputs = args.map((arg) => parse_arg(arg, true))
  const anonymous = rest.trim() === "anonymous"
  if (!anonymous && rest.trim().length > 0) {
    throw new Error(
      `parse_abi: trailing tokens in "${_sig}"`,
    )
  }
  return parse(DescriptionSchema, {
    type: "event",
    name,
    inputs: inputs.map(({ name: n, type, indexed }) => ({
      name: n,
      type,
      indexed: indexed ?? false,
    })),
    anonymous,
  })
}

function parse_error(_sig: string): Description {
  const after_kw = _sig.slice("error ".length)
  const name_end = after_kw.indexOf("(")
  if (name_end < 0) {
    throw new Error(`parse_abi: missing "(" in "${_sig}"`)
  }
  const name = after_kw.slice(0, name_end).trim()
  const { args, rest } = split_arglist(
    after_kw.slice(name_end),
  )
  if (rest.trim().length > 0) {
    throw new Error(
      `parse_abi: trailing tokens in "${_sig}"`,
    )
  }
  const inputs = args.map((arg) => parse_arg(arg, false))
  return parse(DescriptionSchema, {
    type: "error",
    name,
    inputs: inputs.map(({ name: n, type }) => ({
      name: n,
      type,
    })),
  })
}

function parse_constructor(_sig: string): Description {
  const after_kw = _sig.slice("constructor".length)
  const { args, rest } = split_arglist(after_kw)
  let mutability = "nonpayable"
  const cursor = rest.trim()
  for (const m of [
    "pure",
    "view",
    "payable",
    "nonpayable",
  ] as const) {
    if (cursor === m) {
      mutability = m
      break
    }
  }
  const inputs = args.map((arg) => parse_arg(arg, false))
  return parse(DescriptionSchema, {
    type: "constructor",
    inputs: inputs.map(({ name: n, type }) => ({
      name: n,
      type,
    })),
    stateMutability: mutability,
  })
}

const parsedArgSchema = object({
  name: string(),
  type: typeSchema,
  indexed: optional(boolean()),
})
type ParsedArg = InferOutput<typeof parsedArgSchema>

function parse_arg(
  _arg: string,
  allow_indexed: boolean,
): ParsedArg {
  const tokens = _arg.trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) {
    throw new Error("parse_abi: empty argument")
  }
  const type_str = tokens[0] as string
  const type = parse(typeSchema, type_str)
  let indexed = false
  let name = ""
  if (tokens.length === 1) {
    return { name, type }
  }
  let i = 1
  if (allow_indexed && tokens[i] === "indexed") {
    indexed = true
    i += 1
  }
  if (i < tokens.length) {
    name = tokens[i] as string
    i += 1
  }
  if (i < tokens.length) {
    throw new Error(
      `parse_abi: unexpected tokens in "${_arg}"`,
    )
  }
  return allow_indexed
    ? { name, type, indexed }
    : { name, type }
}

// Pull `(...)` from the start of `s`, returning the comma-split arg
// strings and the remainder of `s` after the closing paren.
function split_arglist(_s: string): {
  args: string[]
  rest: string
} {
  const s = _s.trimStart()
  if (!s.startsWith("(")) {
    throw new Error(
      `parse_abi: expected "(", got "${s.slice(0, 8)}…"`,
    )
  }
  const close = find_matching_paren(s, 0)
  const inner = s.slice(1, close).trim()
  const rest = s.slice(close + 1)
  if (inner.length === 0) return { args: [], rest }
  return {
    args: inner.split(",").map((p) => p.trim()),
    rest,
  }
}

function find_matching_paren(
  _s: string,
  _start: number,
): number {
  let depth = 0
  for (let i = _start; i < _s.length; i += 1) {
    const ch = _s[i]
    if (ch === "(") depth += 1
    else if (ch === ")") {
      depth -= 1
      if (depth === 0) return i
    }
  }
  throw new Error("parse_abi: unbalanced parens")
}
