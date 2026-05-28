import { parse } from "valibot"

import type { caip2_Namespace } from "./caip-2/namespace"
import { Caip2_namespaceSchema } from "./caip-2/namespace"
import type { caip2_Reference } from "./caip-2/reference"
import { Caip2_referenceSchema } from "./caip-2/reference"

const DELIMITER = ":"
export function decode_chain_id(chain_id: string): {
  namespace: caip2_Namespace
  reference: caip2_Reference
} {
  const [_namespace, _reference] = chain_id.split(DELIMITER)
  const namespace = parse(Caip2_namespaceSchema, _namespace)
  const reference = parse(Caip2_referenceSchema, _reference)
  return { namespace, reference }
}
