import type { Input } from "valibot"
import { array, parse } from "valibot"

import { jsonSchema } from "../json"

export const abiSchema = array(jsonSchema)
export type Abi = Input<typeof abiSchema>

export function extract(_abi: unknown): Abi {
  const abi = parse(abiSchema, _abi)
  // eslint-disable-next-line no-console
  console.log("extract => abi =>", abi)
  return abi
}
