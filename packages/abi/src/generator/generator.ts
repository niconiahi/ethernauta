import {
  existsSync,
  mkdirSync,
  writeFileSync,
} from "node:fs"
import { join, resolve } from "node:path"
import {
  camel_to_kebab,
  invariant,
} from "@ethernauta/utils"

import type { FunctionInput, FunctionOutput } from "../abi"
import type { Description } from "../abi/description"
import { to_selector } from "../encoding/encode"

function canonical_signature(
  name: string,
  inputs: FunctionInput[],
): string {
  return `${name}(${inputs.map((i) => i.type).join(",")})`
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

export function emit_name_for(
  description: Description,
  descriptions: Description[],
): string {
  if (description.type !== "function") return ""
  const counts = count_names(descriptions)
  if ((counts.get(description.name) || 0) <= 1) {
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
  const js_name = emit_name_for(description, descriptions)
  // preserve snake_case if the source was already snake_case
  // (e.g. `get_data` → `get_data.ts`); otherwise kebab-case.
  if (
    description.type === "function" &&
    description.name.includes("_")
  ) {
    return js_name
  }
  return camel_to_kebab(js_name)
}

type AbiType = string

type Type_info = {
  param_schema: string
  param_type: string
  decoded_schema: string
  decoded_type: string
  builder: string
  valibot: boolean
  package: "eth" | null
}

const VALIBOT_BOOL: Type_info = {
  param_schema: "boolean()",
  param_type: "boolean",
  decoded_schema: "boolean()",
  decoded_type: "boolean",
  builder: "bool()",
  valibot: true,
  package: null,
}

const VALIBOT_STRING: Type_info = {
  param_schema: "string()",
  param_type: "string",
  decoded_schema: "string()",
  decoded_type: "string",
  builder: "string_()",
  valibot: true,
  package: null,
}

function get_type_info(type: AbiType): Type_info {
  switch (type) {
    case "bool":
      return VALIBOT_BOOL
    case "string":
      return VALIBOT_STRING
    case "address":
      return {
        param_schema: "addressSchema",
        param_type: "Address",
        decoded_schema: "addressSchema",
        decoded_type: "Address",
        builder: "address()",
        valibot: false,
        package: "eth",
      }
    case "bytes":
      return {
        param_schema: "bytesSchema",
        param_type: "Bytes",
        decoded_schema: "bytesSchema",
        decoded_type: "Bytes",
        builder: "bytes()",
        valibot: false,
        package: "eth",
      }
    case "bytes4":
      return {
        param_schema: "bytes4Schema",
        param_type: "Bytes4",
        decoded_schema: "bytes4Schema",
        decoded_type: "Bytes4",
        builder: "bytes4()",
        valibot: false,
        package: "eth",
      }
    case "bytes8":
      return {
        param_schema: "bytes8Schema",
        param_type: "Bytes8",
        decoded_schema: "bytes8Schema",
        decoded_type: "Bytes8",
        builder: "bytes8()",
        valibot: false,
        package: "eth",
      }
    case "bytes32":
      return {
        param_schema: "bytes32Schema",
        param_type: "Bytes32",
        decoded_schema: "bytes32Schema",
        decoded_type: "Bytes32",
        builder: "bytes32()",
        valibot: false,
        package: "eth",
      }
    case "uint":
      return {
        param_schema: "uint256Schema",
        param_type: "Uint256",
        decoded_schema: "uint256Schema",
        decoded_type: "Uint256",
        builder: "uint()",
        valibot: false,
        package: "eth",
      }
    case "uint8":
      return {
        param_schema: "uint256Schema",
        param_type: "Uint256",
        decoded_schema: "uint256Schema",
        decoded_type: "Uint256",
        builder: "uint8()",
        valibot: false,
        package: "eth",
      }
    case "uint64":
      return {
        param_schema: "uint256Schema",
        param_type: "Uint256",
        decoded_schema: "uint256Schema",
        decoded_type: "Uint256",
        builder: "uint64()",
        valibot: false,
        package: "eth",
      }
    case "uint256":
      return {
        param_schema: "uint256Schema",
        param_type: "Uint256",
        decoded_schema: "uint256Schema",
        decoded_type: "Uint256",
        builder: "uint256()",
        valibot: false,
        package: "eth",
      }
    case "hash32":
      return {
        param_schema: "hash32Schema",
        param_type: "Hash32",
        decoded_schema: "hash32Schema",
        decoded_type: "Hash32",
        builder: "hash32()",
        valibot: false,
        package: "eth",
      }
    default:
      throw new Error(
        `unhandled abi type "${type}". Please add it to packages/abi/src/generator/generator.ts.`,
      )
  }
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items))
}

function compose_valibot_imports(
  names: string[],
  _is_readable: boolean,
  has_inputs: boolean,
): string {
  const base = new Set<string>(["parse"])
  if (has_inputs) {
    base.add("union")
    base.add("tuple")
    base.add("object")
  }
  for (const n of names) base.add(n)
  const items = Array.from(base).sort()
  const type_import = has_inputs
    ? 'import type { InferOutput } from "valibot"\n'
    : ""
  return `${type_import}import { ${items.join(", ")} } from "valibot"`
}

function compose_core_imports(
  schemas: string[],
  types: string[],
): string {
  if (schemas.length === 0 && types.length === 0) return ""
  const value_imports =
    schemas.length > 0
      ? `import { ${unique(schemas).sort().join(", ")} } from "@ethernauta/core"`
      : ""
  const type_imports =
    types.length > 0
      ? `import type { ${unique(types).sort().join(", ")} } from "@ethernauta/core"`
      : ""
  return [type_imports, value_imports]
    .filter(Boolean)
    .join("\n")
}

function compose_parameters_block(
  inputs: FunctionInput[],
): string {
  if (inputs.length === 0) return ""
  const infos = inputs.map((i) => ({
    name: i.name,
    info: get_type_info(i.type),
  }))
  const tuple_items = infos
    .map((i) => i.info.param_schema)
    .join(", ")
  const object_items = infos
    .map((i) => `${i.name}: ${i.info.param_schema}`)
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
    return "const values: unknown[] = []"
  }
  const by_name = inputs.map((i) => `parameters.${i.name}`)
  return `const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [${by_name.join(", ")}]`
}

function compose_param_codecs_const(
  inputs: FunctionInput[],
): string {
  const builders = inputs
    .map((i) => get_type_info(i.type).builder)
    .join(", ")
  return `const PARAM_CODECS = [${builders}] as const`
}

function compose_output_codecs_const(
  outputs: FunctionOutput[],
): string {
  const builders = outputs
    .map((i) => get_type_info(i.type).builder)
    .join(", ")
  return `const OUTPUT_CODECS = [${builders}] as const`
}

function collect_builders(types: string[]): string[] {
  const set = new Set<string>()
  for (const t of types) {
    // e.g. "address()" -> "address"
    set.add(t.replace("()", ""))
  }
  return Array.from(set).sort()
}

function compose_signature_const(
  name: string,
  inputs: FunctionInput[],
): string {
  const canonical = `${name}(${inputs.map((i) => i.type).join(",")})`
  const names = inputs
    .map((i) => JSON.stringify(i.name))
    .join(", ")
  return `export const SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: ${JSON.stringify(canonical)},
  names: [${names}],
}`
}

function build_readable(
  description: Description,
  emit_name: string,
): string {
  invariant(
    description.type === "function",
    "build_readable requires a function description",
  )
  const { name, inputs, outputs } = description
  invariant(
    outputs.length >= 1,
    `build_readable requires at least one output (${name} has 0)`,
  )
  const output = outputs[0] as FunctionOutput
  const output_info = get_type_info(output.type)
  const input_infos = inputs.map((i) =>
    get_type_info(i.type),
  )

  const eth_schemas: string[] = []
  const eth_types: string[] = []
  const valibot_names = new Set<string>()
  const builders: string[] = []

  for (const info of input_infos) {
    if (info.valibot) {
      valibot_names.add(info.param_schema.replace("()", ""))
    } else if (info.package === "eth") {
      eth_schemas.push(info.param_schema)
    }
    builders.push(info.builder)
  }
  if (output_info.valibot) {
    valibot_names.add(
      output_info.decoded_schema.replace("()", ""),
    )
  } else if (output_info.package === "eth") {
    eth_schemas.push(output_info.decoded_schema)
    eth_types.push(output_info.decoded_type)
  }
  builders.push(output_info.builder)

  const builder_names = collect_builders(builders).join(", ")

  return `import type { Bytes, Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  ${builder_names},
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
${compose_valibot_imports(Array.from(valibot_names), true, inputs.length > 0)}
${compose_core_imports(eth_schemas, eth_types)}

${compose_param_codecs_const(inputs)}
${compose_output_codecs_const(outputs)}

${compose_signature_const(name, inputs)}

${compose_parameters_block(inputs)}

export function ${emit_name}(${inputs.length > 0 ? "_parameters: Parameters" : ""})
: (_context: ContractContext) => Callable<${output_info.decoded_type}> {
  return (
    _context: ContractContext,
  ): Callable<${output_info.decoded_type}> => {
    ${compose_values_extraction(inputs)}
    const calldata = encode_function_call({
      name: "${name}",
      args: PARAM_CODECS,
      values: values as never,
    })
    return {
      chain_id: _context.chain_id,
      to: _context.to,
      data: bytes_to_hex(calldata),
      decode: (_result: Bytes): ${output_info.decoded_type} => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          _result,
        )
        return parse(${output_info.decoded_schema}, decoded)
      },
    }
  }
}
`
}

function build_signable(
  description: Description,
  emit_name: string,
): string {
  invariant(
    description.type === "function",
    "build_signable requires a function description",
  )
  const { name, inputs } = description
  const input_infos = inputs.map((i) =>
    get_type_info(i.type),
  )

  const eth_schemas: string[] = []
  const valibot_names = new Set<string>()
  const builders: string[] = []
  for (const info of input_infos) {
    if (info.valibot) {
      valibot_names.add(info.param_schema.replace("()", ""))
    } else if (info.package === "eth") {
      eth_schemas.push(info.param_schema)
    }
    builders.push(info.builder)
  }

  const builder_names = collect_builders(builders).join(", ")
  const builder_import_line =
    builders.length > 0 ? `${builder_names},\n  ` : ""

  return `import type { Bytes } from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type { ResolvedSigner, Signable } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  ${builder_import_line}encode_function_call,
} from "@ethernauta/abi"
${compose_valibot_imports(Array.from(valibot_names), false, inputs.length > 0)}
${compose_core_imports(eth_schemas, [])}

${compose_param_codecs_const(inputs)}

${compose_signature_const(name, inputs)}

${compose_parameters_block(inputs)}

export function ${emit_name}(${inputs.length > 0 ? "_parameters: Parameters" : ""})
: Signable<Bytes> {
  return async (
    [signer, _context]: ResolvedSigner,
  ): Promise<Bytes> => {
    if (!_context.to)
      throw new Error("contract Signable requires a 'to' on the signer resolver")
    ${compose_values_extraction(inputs)}
    const calldata = encode_function_call({
      name: "${name}",
      args: PARAM_CODECS,
      values: values as never,
    })
    // TODO(wallet): wallet fills nonce, gas, gasPrice / maxFeePerGas /
    //               maxPriorityFeePerGas by querying the network
    //               (eth_getTransactionCount, eth_estimateGas, eth_feeHistory).
    //               Generator MUST leave these fields unset.
    return eth_signTransaction(
      [{
        to: _context.to,
        value: "0x0",
        input: bytes_to_hex(calldata),
      }],
      { _function: SIGNATURE },
    )([signer, _context])
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
    const is_readable =
      description.stateMutability === "view" ||
      description.stateMutability === "pure"
    if (is_readable && description.outputs.length > 1) {
      console.warn(
        `skipping ${description.name}: multi-output methods not yet supported by generator`,
      )
      continue
    }
    const emit_name = emit_name_for(
      description,
      descriptions,
    )
    const file_basename = emit_file_basename_for(
      description,
      descriptions,
    )
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
