import { parse } from "valibot"
import { Caip2_namespaceSchema } from "./caip-2/namespace"
import { Caip2_referenceSchema } from "./caip-2/reference"
import type { ChainId } from "./chain-id"
import { ChainIdSchema } from "./chain-id"

const DELIMITER = ":"
export function encode_chain_id({
  namespace: _namespace,
  reference: _reference,
}: {
  namespace: string
  reference: string | number
}): ChainId {
  const namespace = parse(Caip2_namespaceSchema, _namespace)
  const reference = parse(
    Caip2_referenceSchema,
    typeof _reference === "number"
      ? String(_reference)
      : _reference,
  )
  const _chain_id = namespace + DELIMITER + reference
  const chain_id = parse(ChainIdSchema, _chain_id)
  return chain_id
}
