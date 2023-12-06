import { array, literal, object, string, union, variant } from "valibot"
import { typeSchema } from "../../shared"

export const stateMutabilitySchema = union([
  literal("pure"), // specified to not read blockchain state
  literal("view"), // specified to not modify the blockchain state
  literal("payable"), // function does not accept Ether
  literal("nonpayable"), // function accepts Ether
])
export const function_tupleSchema = object({
  name: string(),
  type: union([
    literal("tuple"),
    literal("tuple[]"),
  ]),
  components: array(typeSchema),
})
export const function_inputSchema = variant("type", [
  object({
    name: string(),
    type: typeSchema,
  }),
  function_tupleSchema,
])
export const outputSchema = function_inputSchema
