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

// Components of a tuple-typed param can themselves be tuples (the
// solidity struct-of-struct case — e.g. ERC-7683's ResolvedCrossChainOrder
// has `tuple[]` fields whose components are `Output`/`FillInstruction`
// structs). `lazy` lets the schema reference itself.
export type TupleComponent = {
  name: string
  type: string
  components?: TupleComponent[]
}
export const tupleComponentSchema: GenericSchema<TupleComponent> =
  lazy(() =>
    variant("type", [
      object({
        name: string(),
        type: typeSchema,
      }),
      object({
        name: string(),
        type: union([
          literal("tuple"),
          literal("tuple[]"),
        ]),
        components: array(tupleComponentSchema),
      }),
    ]),
  )

export const function_tupleSchema = object({
  ...tupleSchema.entries,
  components: array(tupleComponentSchema),
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
