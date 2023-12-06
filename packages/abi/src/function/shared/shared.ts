import { array, literal, merge, object, string, union, variant } from "valibot"
import { tupleSchema, typeSchema } from "../../shared"

// export const function_tupleSchema = merge([
//   tupleSchema,
//   object({
//     components: array(error_inputSchema),
//   }),
// ])
export const stateMutabilitySchema = union([
  literal("pure"), // specified to not read blockchain state
  literal("view"), // specified to not modify the blockchain state
  literal("payable"), // function does not accept Ether
  literal("nonpayable"), // function accepts Ether
])
export const function_tupleSchema = merge([
  tupleSchema,
  object({
    components: array(
      object({
        name: string(),
        type: typeSchema,
      }),
    ),
  }),
])
export const function_inputSchema = variant("type", [
  object({
    name: string(),
    type: typeSchema,
  }),
  function_tupleSchema,
])
export const function_outputSchema = function_inputSchema
