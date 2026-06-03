// https://specs.optimism.io/protocol/predeploys.html#schema-registry

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const SCHEMA_REGISTRY_ADDRESS: Address = parse(
  AddressSchema,
  "0x4200000000000000000000000000000000000020",
)
