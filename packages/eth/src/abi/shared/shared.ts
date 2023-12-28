import { literal, object, string, union } from "valibot"

export const typeSchema = union([
  literal("bool"),
  literal("bool[]"),
  literal("string"),
  literal("string[]"),
  literal("address"),
  literal("address[]"),
  literal("byte"),
  literal("byte[]"),
  literal("bytes"),
  literal("bytes[]"),
  literal("bytes8"),
  literal("bytes8[]"),
  literal("bytes32"),
  literal("bytes32[]"),
  literal("bytes48"),
  literal("bytes48[]"),
  literal("bytes65"),
  literal("bytes65[]"),
  literal("bytes256"),
  literal("bytes256[]"),
  literal("bytesMax32"),
  literal("bytesMax32[]"),
  literal("hash32"),
  literal("hash32[]"),
  literal("uint"),
  literal("uint[]"),
  literal("uint8"),
  literal("uint8[]"),
  literal("uint64"),
  literal("uint64[]"),
  literal("uint256"),
  literal("uint256[]"),
])

export const tupleSchema = object({
  name: string(),
  type: union([
    literal("tuple"),
    literal("tuple[]"),
  ]),
})
