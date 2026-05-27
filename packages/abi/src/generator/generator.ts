import {
  existsSync,
  mkdirSync,
  writeFileSync,
} from "node:fs"
import { join, resolve } from "node:path"
import { camel_to_kebab } from "@ethernauta/utils"

import {
  array,
  type InferOutput,
  object,
  parse,
  set,
  string,
  tupleWithRest,
} from "valibot"

import type { FunctionInput } from "../abi"
import type { Description } from "../abi/description"
import type { _Function } from "../abi/function/function"
import type { AbiInput } from "../abi/function/function-shared"
import {
  abiInputSchema,
  function_outputSchema,
} from "../abi/function/function-shared"
import { to_selector } from "../encoding/encode"

// A function input is either a leaf {name, type} or a tuple with
// nested components. `FunctionInput` (a discriminated union from
// `function_inputSchema`) is structurally assignable to
// `AbiInput` — the recursive Valibot anchor whose tuple variant
// carries `components: AbiInput[]`. The runtime `parse` here is the
// boundary between the loose anchor type and the tuple-arm contract:
// callers only invoke `get_components` when `input.type === "tuple"`
// or `"tuple[]"`, where the variant schema guarantees a non-empty
// components array on the wire.
function get_components(input: AbiInput): AbiInput[] {
  return parse(array(abiInputSchema), input.components)
}

function canonical_type(input: AbiInput): string {
  if (input.type === "tuple") {
    const inner = get_components(input)
      .map(canonical_type)
      .join(",")
    return `(${inner})`
  }
  if (input.type === "tuple[]") {
    const inner = get_components(input)
      .map(canonical_type)
      .join(",")
    return `(${inner})[]`
  }
  return input.type
}

function canonical_signature(
  name: string,
  inputs: FunctionInput[],
): string {
  return `${name}(${inputs
    .map((i) => canonical_type(i))
    .join(",")})`
}

function selector_suffix(signature: string): string {
  const bytes = to_selector(signature)
  let hex = ""
  for (const b of bytes) {
    hex += b.toString(16).padStart(2, "0")
  }
  return hex
}

function count_names(
  descriptions: Description[],
): Map<string, number> {
  const counts = new Map<string, number>()
  for (const d of descriptions) {
    if (d.type !== "function") continue
    counts.set(d.name, (counts.get(d.name) || 0) + 1)
  }
  return counts
}

// Real ABIs can have functions whose names differ only by case
// (`DECIMALS` vs `decimals` on OP's GasPriceOracle). camel_to_kebab
// lowercases both to `decimals`, which collides on the emitted
// filename even though the JS identifier is distinct. Counting
// kebab-cased basenames catches that class of collision so the
// suffix branch fires for both siblings.
function count_filename_basenames(
  descriptions: Description[],
): Map<string, number> {
  const counts = new Map<string, number>()
  for (const d of descriptions) {
    if (d.type !== "function") continue
    const base = camel_to_kebab(d.name)
    counts.set(base, (counts.get(base) || 0) + 1)
  }
  return counts
}

export function emit_name_for(
  description: Description,
  descriptions: Description[],
): string {
  if (description.type !== "function") return ""
  const name_counts = count_names(descriptions)
  const file_counts = count_filename_basenames(descriptions)
  const base = camel_to_kebab(description.name)
  const overloaded = (name_counts.get(description.name) || 0) > 1
  const file_collides = (file_counts.get(base) || 0) > 1
  if (!overloaded && !file_collides) {
    return description.name
  }
  const sig = canonical_signature(
    description.name,
    description.inputs,
  )
  return `${description.name}_${selector_suffix(sig)}`
}

export function emit_file_basename_for(
  description: Description,
  descriptions: Description[],
): string {
  // camel_to_kebab lowercases case-boundary transitions
  // (`balanceOf` → `balance-of`) and leaves existing
  // underscores intact (`get_data` → `get_data`,
  // `DOMAIN_SEPARATOR` → `domain_separator`).
  return camel_to_kebab(
    emit_name_for(description, descriptions),
  )
}

// Codegen carries four parallel import-requirement sets per type:
//   - valibot_names: bare symbols imported from "valibot" (e.g. "boolean",
//     "object", "v_array"). The `v_array` symbol is aliased on import as
//     `array as v_array` to avoid colliding with abi's `array`.
//   - core_schemas / core_types: value + type imports from "@ethernauta/core".
//   - abi_builders: bare codec-builder symbols from "@ethernauta/abi"
//     (e.g. "address", "uint256", "array", "abi_tuple"). `abi_tuple` is
//     aliased on import as `tuple as abi_tuple` to avoid colliding with
//     valibot's `tuple`.
const typeInfoSchema = object({
  param_schema: string(),
  param_type: string(),
  decoded_schema: string(),
  decoded_type: string(),
  builder: string(),
  valibot_names: set(string()),
  core_schemas: set(string()),
  core_types: set(string()),
  abi_builders: set(string()),
})
type TypeInfo = InferOutput<typeof typeInfoSchema>

function valibot_leaf(
  valibot_name: string,
  ts_type: string,
  builder_name: string,
): TypeInfo {
  return {
    param_schema: `${valibot_name}()`,
    param_type: ts_type,
    decoded_schema: `${valibot_name}()`,
    decoded_type: ts_type,
    builder: `${builder_name}()`,
    valibot_names: new Set([valibot_name]),
    core_schemas: new Set(),
    core_types: new Set(),
    abi_builders: new Set([builder_name]),
  }
}

function core_leaf(
  schema_name: string,
  ts_type: string,
  builder_name: string,
): TypeInfo {
  return {
    param_schema: schema_name,
    param_type: ts_type,
    decoded_schema: schema_name,
    decoded_type: ts_type,
    builder: `${builder_name}()`,
    valibot_names: new Set(),
    core_schemas: new Set([schema_name]),
    core_types: new Set([ts_type]),
    abi_builders: new Set([builder_name]),
  }
}

function merge_into(
  target: TypeInfo,
  child: TypeInfo,
): void {
  for (const v of child.valibot_names)
    target.valibot_names.add(v)
  for (const s of child.core_schemas)
    target.core_schemas.add(s)
  for (const t of child.core_types) target.core_types.add(t)
  for (const b of child.abi_builders)
    target.abi_builders.add(b)
}

function get_type_info(input: AbiInput): TypeInfo {
  const type = input.type

  if (type === "tuple" || type === "tuple[]") {
    const components = get_components(input)
    const child_infos = components.map((c) =>
      get_type_info(c),
    )

    const schema_fields = components
      .map(
        (c, i) =>
          `${c.name}: ${child_infos[i]?.param_schema}`,
      )
      .join(", ")
    const struct_schema = `object({ ${schema_fields} })`

    const type_fields = components
      .map(
        (c, i) =>
          `${c.name}: ${child_infos[i]?.param_type}`,
      )
      .join("; ")
    const struct_type = `{ ${type_fields} }`

    const builder_fields = components
      .map(
        (c, i) => `${c.name}: ${child_infos[i]?.builder}`,
      )
      .join(", ")
    const struct_builder = `abi_tuple({ ${builder_fields} })`

    const info: TypeInfo = {
      param_schema: struct_schema,
      param_type: struct_type,
      decoded_schema: struct_schema,
      decoded_type: struct_type,
      builder: struct_builder,
      valibot_names: new Set(["object"]),
      core_schemas: new Set(),
      core_types: new Set(),
      abi_builders: new Set(["abi_tuple"]),
    }
    for (const child of child_infos) merge_into(info, child)

    if (type === "tuple[]") {
      info.valibot_names.add("v_array")
      info.abi_builders.add("array")
      return {
        ...info,
        param_schema: `v_array(${struct_schema})`,
        param_type: `${struct_type}[]`,
        decoded_schema: `v_array(${struct_schema})`,
        decoded_type: `${struct_type}[]`,
        builder: `array(${struct_builder})`,
      }
    }
    return info
  }

  // Dynamic array of a primitive (or another array): T[]
  const arr_match = /^(.+)\[\]$/.exec(type)
  if (arr_match) {
    const inner_type = arr_match[1] as string
    const inner = get_type_info({
      name: input.name,
      type: inner_type,
    })
    const info: TypeInfo = {
      param_schema: `v_array(${inner.param_schema})`,
      param_type: `${inner.param_type}[]`,
      decoded_schema: `v_array(${inner.decoded_schema})`,
      decoded_type: `${inner.decoded_type}[]`,
      builder: `array(${inner.builder})`,
      valibot_names: new Set(inner.valibot_names),
      core_schemas: new Set(inner.core_schemas),
      core_types: new Set(inner.core_types),
      abi_builders: new Set(inner.abi_builders),
    }
    info.valibot_names.add("v_array")
    info.abi_builders.add("array")
    return info
  }

  switch (type) {
    case "bool":
      return valibot_leaf("boolean", "boolean", "bool")
    case "string":
      return valibot_leaf("string", "string", "string_")
    case "address":
      return core_leaf(
        "addressSchema",
        "Address",
        "address",
      )
    case "bytes":
      return core_leaf("bytesSchema", "Bytes", "bytes")
    case "bytes4":
      return core_leaf("bytes4Schema", "Bytes4", "bytes4")
    case "bytes8":
      return core_leaf("bytes8Schema", "Bytes8", "bytes8")
    case "bytes32":
      return core_leaf(
        "bytes32Schema",
        "Bytes32",
        "bytes32",
      )
    case "uint":
      return core_leaf("uint256Schema", "Uint256", "uint")
    case "hash32":
      return core_leaf("hash32Schema", "Hash32", "hash32")
    default: {
      const uint_match = /^uint(\d+)$/.exec(type)
      if (uint_match) {
        const bits = Number(uint_match[1])
        const supported = new Set([
          8, 16, 24, 32, 40, 48, 56, 64, 96, 128, 160, 192,
          224, 256,
        ])
        if (supported.has(bits)) {
          return core_leaf(
            `uint${bits}Schema`,
            `Uint${bits}`,
            `uint${bits}`,
          )
        }
        if (bits >= 8 && bits <= 256 && bits % 8 === 0) {
          throw new Error(
            `uint${bits} is a valid solidity type but has no corresponding schema in @ethernauta/core. Add packages/core/src/uint-${bits}.ts (mirror uint-8.ts) and packages/abi/src/leaves.ts:uint${bits}().`,
          )
        }
      }
      throw new Error(
        `unhandled abi type "${type}". Please add it to packages/abi/src/generator/generator.ts.`,
      )
    }
  }
}

function compose_valibot_imports(
  collected: Set<string>,
  has_inputs: boolean,
): string {
  const base = new Set<string>(["parse"])
  if (has_inputs) {
    base.add("union")
    base.add("tuple")
    base.add("object")
  }
  for (const n of collected) base.add(n)
  const items = Array.from(base)
    .sort()
    .map((n) => (n === "v_array" ? "array as v_array" : n))
  const type_import = has_inputs
    ? 'import type { InferOutput } from "valibot"\n'
    : ""
  return `${type_import}import { ${items.join(", ")} } from "valibot"`
}

function compose_core_imports(
  schemas: Set<string>,
  types: Set<string>,
): string {
  // `Bytes` is always imported at the top of every generated file (it's the
  // input type for the decoder). Dedupe it out of the per-method type set.
  const filtered_types = Array.from(types).filter(
    (t) => t !== "Bytes",
  )
  if (schemas.size === 0 && filtered_types.length === 0)
    return ""
  const value_imports =
    schemas.size > 0
      ? `import { ${Array.from(schemas).sort().join(", ")} } from "@ethernauta/core"`
      : ""
  const type_imports =
    filtered_types.length > 0
      ? `import type { ${filtered_types.sort().join(", ")} } from "@ethernauta/core"`
      : ""
  return [type_imports, value_imports]
    .filter(Boolean)
    .join("\n")
}

function compose_abi_imports(
  builders: Set<string>,
  extra: string[],
): string {
  const items = [
    ...Array.from(builders)
      .sort()
      .map((n) =>
        n === "abi_tuple" ? "tuple as abi_tuple" : n,
      ),
    ...extra,
  ]
  return `import {
  ${items.join(",\n  ")},
} from "@ethernauta/abi"`
}

function compose_parameters_block(
  inputs: FunctionInput[],
  infos: TypeInfo[],
): string {
  if (inputs.length === 0) return ""
  const tuple_items = infos
    .map((i) => i.param_schema)
    .join(", ")
  const object_items = inputs
    .map(
      (input, i) =>
        `${input.name}: ${infos[i]?.param_schema}`,
    )
    .join(", ")
  return `const parametersSchema = union([
  tuple([${tuple_items}]),
  object({ ${object_items} }),
])
type Parameters = InferOutput<typeof parametersSchema>`
}

function compose_values_extraction(
  inputs: FunctionInput[],
): string {
  if (inputs.length === 0) {
    return "const values = [] as const"
  }
  const by_index = inputs
    .map((_input, i) => `parameters[${i}]`)
    .join(", ")
  const by_name = inputs
    .map((i) => `parameters.${i.name}`)
    .join(", ")
  // Each branch builds a fresh tuple via `as const` so TS infers the
  // readonly per-position tuple type that lines up with the codec
  // tuple's `Args` slot — without this, ternary widening collapses
  // `[A, B] | [A, B]` into `(A | B)[]` and the strict generic call
  // to `encode_function_call` rejects the loose array shape.
  return `const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([${by_index}] as const)
      : ([${by_name}] as const)`
}

function compose_param_codecs_const(
  infos: TypeInfo[],
): string {
  const builders = infos.map((i) => i.builder).join(", ")
  return `const PARAM_CODECS = [${builders}] as const`
}

function compose_output_codecs_const(
  infos: TypeInfo[],
): string {
  const builders = infos.map((i) => i.builder).join(", ")
  return `const OUTPUT_CODECS = [${builders}] as const`
}

function signature_const_name(emit_name: string): string {
  return `${camel_to_kebab(emit_name).replace(/-/g, "_").toUpperCase()}_SIGNATURE`
}

function compose_signature_const(
  name: string,
  emit_name: string,
  inputs: FunctionInput[],
): string {
  const canonical = canonical_signature(name, inputs)
  const names = inputs
    .map((i) => JSON.stringify(i.name))
    .join(", ")
  return `export const ${signature_const_name(emit_name)} = {
  signature: ${JSON.stringify(canonical)},
  names: [${names}],
}`
}

const aggregateSchema = object({
  valibot_names: set(string()),
  core_schemas: set(string()),
  core_types: set(string()),
  abi_builders: set(string()),
})
type Aggregate = InferOutput<typeof aggregateSchema>

function empty_aggregate(): Aggregate {
  return {
    valibot_names: new Set<string>(),
    core_schemas: new Set<string>(),
    core_types: new Set<string>(),
    abi_builders: new Set<string>(),
  }
}

// Inputs contribute schemas, valibot symbols, and builders, but NOT
// core types: the `Parameters` type is derived from `parametersSchema`
// via `InferOutput`, so no input type ever appears directly. Outputs
// contribute everything because the decoded type is the return type.
function fold_input(
  target: Aggregate,
  info: TypeInfo,
): void {
  for (const v of info.valibot_names)
    target.valibot_names.add(v)
  for (const s of info.core_schemas)
    target.core_schemas.add(s)
  for (const b of info.abi_builders)
    target.abi_builders.add(b)
}

function fold_output(
  target: Aggregate,
  info: TypeInfo,
): void {
  for (const v of info.valibot_names)
    target.valibot_names.add(v)
  for (const s of info.core_schemas)
    target.core_schemas.add(s)
  for (const t of info.core_types) target.core_types.add(t)
  for (const b of info.abi_builders)
    target.abi_builders.add(b)
}

function build_readable(
  description: _Function,
  emit_name: string,
): string {
  const { name, inputs } = description
  const outputs = parse(
    tupleWithRest(
      [function_outputSchema],
      function_outputSchema,
    ),
    description.outputs,
  )
  const input_infos = inputs.map((i) => get_type_info(i))
  const output_infos = outputs.map((o) => get_type_info(o))

  const agg = empty_aggregate()
  for (const info of input_infos) fold_input(agg, info)
  for (const info of output_infos) fold_output(agg, info)
  // Callable.data is bytesSchema-branded; the template wraps the
  // bytes_to_hex(calldata) emit in parse(bytesSchema, …).
  agg.core_schemas.add("bytesSchema")

  const is_tuple = output_infos.length > 1
  const return_type = is_tuple
    ? `[${output_infos.map((i) => i.decoded_type).join(", ")}]`
    : output_infos[0]?.decoded_type
  const decode_body = is_tuple
    ? `const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          ${output_infos
            .map(
              (i, idx) =>
                `parse(${i.decoded_schema}, decoded[${idx}])`,
            )
            .join(",\n          ")},
        ]`
    : `const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(${output_infos[0]?.decoded_schema}, decoded)`

  return `import type { Bytes } from "@ethernauta/core"
import type { Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
${compose_abi_imports(agg.abi_builders, [
  "decode_function_result",
  "encode_function_call",
])}
${compose_valibot_imports(agg.valibot_names, inputs.length > 0)}
${compose_core_imports(agg.core_schemas, agg.core_types)}

${compose_param_codecs_const(input_infos)}
${compose_output_codecs_const(output_infos)}

${compose_signature_const(name, emit_name, inputs)}

${compose_parameters_block(inputs, input_infos)}

export function ${emit_name}(${inputs.length > 0 ? "_parameters: Parameters" : ""}) {
  return (context: ContractContext): Callable<${return_type}> => {
    ${compose_values_extraction(inputs)}
    const calldata = encode_function_call({
      name: "${name}",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(bytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): ${return_type} => {
        ${decode_body}
      },
    }
  }
}
`
}

function build_signable(
  description: _Function,
  emit_name: string,
): string {
  const { name, inputs } = description
  const input_infos = inputs.map((i) => get_type_info(i))
  const agg = empty_aggregate()
  for (const info of input_infos) fold_input(agg, info)
  // The emitted eth_signTransaction payload routes its `value` and
  // `input` fields through parse(uintSchema, "0x0") and
  // parse(bytesSchema, bytes_to_hex(...)) — Signable<Bytes> requires
  // the brand on `data`, genericTransactionSchema requires brands on
  // both fields.
  agg.core_schemas.add("bytesSchema")
  agg.core_schemas.add("uintSchema")

  return `import type { Bytes } from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type { ResolvedSigner, Signable } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
${compose_abi_imports(agg.abi_builders, ["encode_function_call"])}
${compose_valibot_imports(agg.valibot_names, inputs.length > 0)}
${compose_core_imports(agg.core_schemas, agg.core_types)}

${compose_param_codecs_const(input_infos)}

${compose_signature_const(name, emit_name, inputs)}

${compose_parameters_block(inputs, input_infos)}

export function ${emit_name}(${inputs.length > 0 ? "_parameters: Parameters" : ""}): Signable<Bytes> {
  return async ([signer, context]: ResolvedSigner): Promise<Bytes> => {
    if (!context.to)
      throw new Error("contract Signable requires a 'to' on the signer resolver")
    ${compose_values_extraction(inputs)}
    const calldata = encode_function_call({
      name: "${name}",
      args: PARAM_CODECS,
      values,
    })
    // TODO(wallet): wallet fills nonce, gas, gasPrice / maxFeePerGas /
    //               maxPriorityFeePerGas by querying the network
    //               (eth_getTransactionCount, eth_estimateGas, eth_feeHistory).
    //               Generator MUST leave these fields unset.
    return eth_signTransaction(
      [{
        to: context.to,
        value: parse(uintSchema, "0x0"),
        input: parse(bytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: ${signature_const_name(emit_name)},
        },
      }],
    )([signer, context])
  }
}
`
}

export function generate(
  descriptions: Description[],
  out_dir: string,
): void {
  const resolved_out_dir = resolve(out_dir, "methods")
  if (!existsSync(resolved_out_dir)) {
    mkdirSync(resolved_out_dir, { recursive: true })
  }
  for (const description of descriptions) {
    if (description.type !== "function") continue
    const emit_name = emit_name_for(
      description,
      descriptions,
    )
    const file_basename = emit_file_basename_for(
      description,
      descriptions,
    )
    const is_readable =
      description.stateMutability === "view" ||
      description.stateMutability === "pure"
    const body = is_readable
      ? build_readable(description, emit_name)
      : build_signable(description, emit_name)
    const file_path = join(
      resolved_out_dir,
      `${file_basename}.ts`,
    )
    writeFileSync(file_path, body)
  }
}
