import {
  existsSync,
  mkdirSync,
  writeFileSync,
} from "node:fs"
import { join, resolve } from "node:path"
import { camel_to_kebab } from "../utils/camel-to-kebab"
import invariant from "../utils/tiny-invariant"
import type { Description } from "./description"
import type { FunctionInput } from "./function"

/*
 * creates the corresponding ABI files to call the chain
 * */
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
            make_nonpayable_function(description, out_dir)
            continue
          }
        }
      }
    }
  }
}

function compose_tuple_parameter_items(
  inputs: FunctionInput[],
): {
  output: string
  package_imports: Set<Import>
  valibot_imports: Set<Import>
} {
  let package_imports: Set<Import> = new Set([])
  let valibot_imports: Set<Import> = new Set([])
  let schemas: string[] = []
  for (const input of inputs) {
    if (input.type === "bool") {
      const schema = "boolean()"
      const type = "boolean"
      schemas.push(schema)
      valibot_imports.add({
        schema,
        type,
      })
      continue
    }
    const { schema, type } = get_schema_for_input(input)
    schemas.push(schema)
    package_imports.add({
      schema,
      type,
    })
  }
  const output = schemas.join(", ").trim()
  return {
    output,
    package_imports,
    valibot_imports,
  }
}
// {
//   "inputs": [
//     {
//       "internalType": "address",
//       "name": "to",
//       "type": "address"
//     },
//     {
//       "internalType": "uint256",
//       "name": "tokenId",
//       "type": "uint256"
//     }
//   ],
//   "name": "approve",
//   "outputs": [],
//   "stateMutability": "nonpayable",
//   "type": "function"
// },

function get_schema_for_input(input: FunctionInput) {
  switch (input.type) {
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
        `unhandled function input type ${input.type}. Please inform this to the library owner`,
      )
    }
  }
}

export type Import = {
  schema: string
  type: string
}

// set-approval-for-all
// is-approved-for-all
function compose_object_parameter_items(
  inputs: FunctionInput[],
): {
  output: string
  package_imports: Set<Import>
  valibot_imports: Set<Import>
} {
  let package_imports: Set<Import> = new Set([])
  let valibot_imports: Set<Import> = new Set([])
  const lines: string[] = []
  for (const input of inputs) {
    if (input.type === "bool") {
      const schema = "boolean()"
      const type = "boolean"
      lines.push(`${input.name}: ${schema}`)
      valibot_imports.add({
        schema,
        type,
      })
      continue
    }
    const { schema, type } = get_schema_for_input(input)
    lines.push(`${input.name}: ${schema}`)
    package_imports.add({
      schema,
      type,
    })
  }
  const output = lines.join(",\n    ").trim()
  return {
    output,
    valibot_imports,
    package_imports,
  }
}

function compose_parameters(inputs: FunctionInput[]) {
  const {
    output: tuple_output,
    valibot_imports: tuple_valibot_imports,
    package_imports: tuple_package_imports,
  } = compose_tuple_parameter_items(inputs)
  const tuple_parameter = `tuple([${tuple_output}])`
  const {
    output: object_output,
    valibot_imports: object_valibot_imports,
    package_imports: object_package_imports,
  } = compose_object_parameter_items(inputs)
  const object_parameter = `
object({
    ${object_output}
  })`.trim()
  invariant(
    tuple_package_imports.size ===
      object_package_imports.size,
    "tuple and object must match the amount of package imports",
  )
  invariant(
    tuple_valibot_imports.size ===
      object_valibot_imports.size,
    "tuple and object must match the amount of valibot imports",
  )
  const parameters = [
    tuple_parameter,
    object_parameter,
  ].join(",\n  ")
  return {
    parameters,
    package_imports: dedupe_imports(tuple_package_imports),
    valibot_imports: dedupe_imports(tuple_valibot_imports),
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

function format_for_type(items: string[]): string {
  return items.join(" | ").trim()
}

function format_for_union(items: string[]): string {
  return items.join(", ").trim()
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
  invariant(
    description.stateMutability === "view",
    "the function's state mutability has to be a view to make a view function",
  )
  const { parameters, package_imports, valibot_imports } =
    compose_parameters(description.inputs)
  const method = description.name
  const template = `
import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  object,
  parse,
  tuple,
  union,
  ${format_for_import(
    remove_parenthesis(get_schemas(valibot_imports)),
  )}
} from "valibot"

import {
  ${format_for_import(get_schemas(package_imports))}
} from "@ethernauta/eth"
import type {
  ${format_for_import(get_types(package_imports))}
} from "@ethernauta/eth"

const parametersSchema = union([
  ${parameters}
])
type Parameters = InferOutput<typeof parametersSchema>
export function ${method}(
  _parameters: Parameters,
): Readable<${format_for_type(get_types(package_imports))}> {
  return async (
    transports: Http[],
  ): Promise<${format_for_type(get_types(package_imports))}> => {
    const method = "${method}"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([${format_for_union(get_schemas(package_imports))}]),
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
    `${camel_to_kebab(method)}.ts`,
  )
  writeFileSync(file_path, template)
}

function make_nonpayable_function(
  description: Description,
  out_dir: string,
) {
  invariant(
    description.type === "function",
    "the description has to be a function to make a nonpayable function",
  )
  invariant(
    description.stateMutability === "nonpayable",
    "the function's state mutability has to be nonpayable to make a nonpayable function",
  )
  const { parameters, package_imports, valibot_imports } =
    compose_parameters(description.inputs)
  const method = description.name
  const template = `
import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  object,
  parse,
  tuple,
  union,
  ${format_for_import(remove_parenthesis(get_schemas(valibot_imports)))}
} from "valibot"

import {
  ${format_for_import(get_schemas(package_imports))}
} from "@ethernauta/eth"
import type {
  ${format_for_import(get_types(package_imports))}
} from "@ethernauta/eth"

const parametersSchema = union([
  ${parameters}
])
type Parameters = InferOutput<typeof parametersSchema>
export function ${method}(
  _parameters: Parameters,
): Readable<${format_for_type(get_types(package_imports))}> {
  return async (
    transports: Http[],
  ): Promise<${format_for_type(get_types(package_imports))}> => {
    const method = "${method}"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([${format_for_union(get_schemas(package_imports))}]),
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
    `${camel_to_kebab(method)}.ts`,
  )
  writeFileSync(file_path, template)
}
