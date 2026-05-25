import {
  array,
  type GenericSchema,
  type InferOutput,
  lazy,
  literal,
  object,
  string,
  union,
  variant,
} from "valibot"
import { tupleSchema, typeSchema } from "../shared"

export const stateMutabilitySchema = union([
  literal("pure"), // specified to not read blockchain state
  literal("view"), // specified to not modify the blockchain state
  literal("payable"), // function does not accept Ether
  literal("nonpayable"), // function accepts Ether
])

// The recursive ABI input/output entry shape. A leaf carries
// `{ name, type }`; a tuple variant carries `{ name, type: "tuple" |
// "tuple[]", components: AbiInput[] }`. Used for function inputs /
// outputs and event params alike — solidity struct-of-struct cases
// (e.g. ERC-7683's ResolvedCrossChainOrder, whose `tuple[]` components
// are themselves `Output` / `FillInstruction` structs) need this self-
// reference. `lazy` lets the schema cycle through itself.
// allow-violation: R4-recursive-schema
export type AbiInput = {
  name: string
  type: string
  components?: AbiInput[]
}
export const abiInputSchema: GenericSchema<AbiInput> = lazy(
  () =>
    variant("type", [
      object({
        name: string(),
        type: typeSchema,
      }),
      object({
        name: string(),
        type: union([literal("tuple"), literal("tuple[]")]),
        components: array(abiInputSchema),
      }),
    ]),
)

export const function_tupleSchema = object({
  ...tupleSchema.entries,
  components: array(abiInputSchema),
})
export const function_inputSchema = variant("type", [
  object({
    name: string(),
    type: typeSchema,
  }),
  function_tupleSchema,
])
export type FunctionInput = InferOutput<
  typeof function_inputSchema
>
export const function_outputSchema = function_inputSchema
export type FunctionOutput = InferOutput<
  typeof function_outputSchema
>
