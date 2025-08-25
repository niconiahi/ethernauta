import {
  existsSync,
  mkdirSync,
  writeFileSync,
} from "node:fs"
import { join, resolve } from "node:path"
import { camel_to_kebab } from "../utils/camel-to-kebab"
import invariant from "../utils/tiny-invariant"
import type { Description } from "../abi/description"
import type { FunctionInput, FunctionOutput } from "../abi"

export type Import = {
  name: string
  schema: string
  type: string
}

export function compile(
  descriptions: Description[],
  out_dir: string,
): void {
  for (const description of descriptions) {
    switch (description.type) {
      case "function": {
        switch (description.stateMutability) {
          case "view": {
            make_view_function(description, out_dir)
            continue
          }
          case "nonpayable": {
            make_view_function(description, out_dir)
            continue
          }
        }
      }
    }
  }
}

function make_imports(
  inputs: FunctionInput[] | FunctionOutput[],
): {
  package_imports: Set<Import>
  valibot_imports: Set<Import>
} {
  let package_imports: Set<Import> = new Set([])
  let valibot_imports: Set<Import> = new Set([])
  for (const input of inputs) {
    if (input.type === "bool") {
      const schema = "boolean()"
      const type = "boolean"
      const name = input.name
      valibot_imports.add({
        name,
        schema,
        type,
      })
      continue
    }
    const { schema, type } = get_schema_for_type(input.type)
    const name = input.name
    package_imports.add({
      name,
      schema,
      type,
    })
  }
  return {
    package_imports,
    valibot_imports,
  }
}

function get_schema_for_type(
  type: FunctionInput["type"] | FunctionOutput["type"],
) {
  switch (type) {
    case "address": {
      return { schema: "addressSchema", type: "Address" }
    }
    case "bytes4": {
      return { schema: "bytes4Schema", type: "Bytes4" }
    }
    case "uint256": {
      return { schema: "uint256Schema", type: "Uint256" }
    }
    case "bytes": {
      return { schema: "bytesSchema", type: "Bytes" }
    }
    default: {
      throw new Error(
        `unhandled function input type ${type}. Please inform this to the library owner`,
      )
    }
  }
}

export function get_schemas(set: Set<Import>): string[] {
  return Array.from(set).map((import_) => {
    return import_.schema
  })
}

function get_types(set: Set<Import>): string[] {
  return Array.from(set).map((import_) => {
    return import_.type
  })
}

function format_for_import(items: string[]): string {
  return items.join(",\n  ").trim()
}

function format_as_comma_separated(
  items: string[],
): string {
  return items.join(", ").trim()
}

function format_as_union(items: string[]): string {
  return items.join(" | ").trim()
}

function format_as_key_values(set: Set<Import>): string {
  return Array.from(set)
    .map((import_) => {
      return `${import_.name}: ${import_.schema}`
    })
    .join(",\n")
    .trim()
}

export function dedupe_imports(
  imports: Set<Import>,
): Set<Import> {
  const out: Set<Import> = new Set([])
  const types = new Set(
    Array.from(imports).map((import_) => {
      return import_.type
    }),
  )
  for (const import_ of imports) {
    const type = import_.type
    if (types.has(type)) {
      out.add(import_)
      types.delete(type)
    }
  }
  return out
}

export function merge_imports(
  imports_a: Set<Import>,
  imports_b: Set<Import>,
): Set<Import> {
  const merged: Set<Import> = new Set([])
  for (const import_ of imports_a) {
    merged.add(import_)
  }
  for (const import_ of imports_b) {
    merged.add(import_)
  }
  return dedupe_imports(merged)
}

function compose_parameters_template(
  imports: Set<Import>,
  name: string,
) {
  return imports.size > 0
    ? `
const parametersSchema = union([
  tuple([${format_as_comma_separated(get_schemas(imports))}]),
  object({
    ${format_as_key_values(imports)}
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function ${name}(_parameters: Parameters)`.trim()
    : `
export function ${name}()`.trim()
}

function compose_call_template(imports: Set<Import>) {
  return imports.size > 0
    ? `
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])`.trim()
    : `
    const call = parse(callSchema, [method, []])`.trim()
}

function compose_valibot_imports(
  valibot_imports: Set<Import>,
  package_imports: Set<Import>,
  inputs: Set<Import>,
) {
  if (valibot_imports.size > 0) {
    return `
import type { InferOutput } from "valibot"
import {
  parse,
  tuple,
  object,
  union,
  ${format_for_import(
    remove_parenthesis(get_schemas(valibot_imports)),
  )}
} from "valibot"`.trim()
  }
  if (package_imports.size > 0 && inputs.size === 0) {
    return `
import {
  parse,
  union,
} from "valibot"`.trim()
  }
  if (package_imports.size > 0) {
    return `
import type { InferOutput } from "valibot"
import {
  parse,
  union,
  tuple,
  object
} from "valibot"`.trim()
  }
  return ""
}

function compose_type_package_imports(
  imports: Set<Import>,
) {
  if (imports.size > 0) {
    return `
import type {
  ${format_for_import(get_types(imports))}
} from "@ethernauta/eth"`.trim()
  }
  return ""
}

export function remove_parenthesis(strings: string[]) {
  return strings.map((string) => {
    return string.slice(0, -2)
  })
}

function make_view_function(
  description: Description,
  out_dir: string,
) {
  invariant(
    description.type === "function",
    "the description has to a function to make a view function",
  )
  // invariant(
  //   description.stateMutability === "view",
  //   "the function's state mutability has to be a view to make a view function",
  // )
  const {
    valibot_imports: inputs_valibot_imports,
    package_imports: inputs_package_imports,
  } = make_imports(description.inputs)
  const inputs = merge_imports(
    inputs_package_imports,
    inputs_valibot_imports,
  )
  const {
    valibot_imports: outputs_valibot_imports,
    package_imports: outputs_package_imports,
  } = make_imports(description.outputs)
  const outputs = merge_imports(
    outputs_package_imports,
    outputs_valibot_imports,
  )
  const valibot_imports = merge_imports(
    inputs_valibot_imports,
    outputs_valibot_imports,
  )
  const package_imports = merge_imports(
    inputs_package_imports,
    outputs_package_imports,
  )
  // if (description.name === "totalSupply") {
  //   console.log("description", description)
  //   console.log(
  //     "inputs_valibot_imports",
  //     inputs_valibot_imports,
  //   )
  //   console.log(
  //     "outputs_valibot_imports",
  //     outputs_valibot_imports,
  //   )
  //   console.log("valibot_imports", valibot_imports)
  //   console.log("valibot_imports", valibot_imports)
  //   console.log("package_imports", package_imports)
  // }
  const name = description.name
  const template = `
import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
${compose_valibot_imports(valibot_imports, package_imports, inputs)}
import {
  ${format_for_import(get_schemas(package_imports))}
} from "@ethernauta/eth"
${compose_type_package_imports(outputs_package_imports)}

${compose_parameters_template(inputs, name)}
: Readable<${format_as_union(get_types(outputs))}> {
  return async (
    transports: Http[],
  ): Promise<${format_as_union(get_types(outputs))}> => {
    const method = "${name}"
    ${compose_call_template(inputs)}
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([${format_as_union(get_schemas(outputs))}]),
      response.result,
    )
    return result
  }
}`.trim()
  const resolved_out_dir = resolve(out_dir, "methods")
  if (!existsSync(resolved_out_dir)) {
    mkdirSync(resolved_out_dir)
  }
  const file_path = join(
    resolved_out_dir,
    `${camel_to_kebab(name)}.ts`,
  )
  writeFileSync(file_path, template)
}
