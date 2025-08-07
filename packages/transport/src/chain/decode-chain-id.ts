import { parse } from "valibot"

import type { caip2_Namespace } from "./caip-2/namespace"
import { caip2_namespaceSchema } from "./caip-2/namespace"
import type { caip2_Reference } from "./caip-2/reference"
import { caip2_referenceSchema } from "./caip-2/reference"

const DELIMITER = ":"
export function decodeChainId(chainId: string): {
  namespace: caip2_Namespace
  reference: caip2_Reference
} {
  const [_namespace, _reference] = chainId.split(DELIMITER)
  const namespace = parse(caip2_namespaceSchema, _namespace)
  const reference = parse(caip2_referenceSchema, _reference)
  return { namespace, reference }
}
