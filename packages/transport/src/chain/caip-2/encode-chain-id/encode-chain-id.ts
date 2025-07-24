import { parse } from "valibot"

import type { ChainId } from "../chain-id"
import { chainIdSchema } from "../chain-id"
import { caip2_namespaceSchema } from "../namespace"
import { caip2_referenceSchema } from "../reference"

const DELIMITER = ":"
export function encodeChainId({
  namespace: _namespace,
  reference: _reference,
}: {
  namespace: string
  reference: string | number
}): ChainId {
  const namespace = parse(caip2_namespaceSchema, _namespace)
  const reference = parse(
    caip2_referenceSchema,
    typeof _reference === "number" ? String(_reference) : _reference,
  )
  const _chainId = namespace + DELIMITER + reference
  const chainId = parse(chainIdSchema, _chainId)
  return chainId
}
