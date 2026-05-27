// https://specs.optimism.io/protocol/predeploys.html#gaspriceoracle
// The OP-stack GasPriceOracle predeploy address is identical across
// every chain in the family (Base, Optimism, Mode, Zora, Mantle,
// World Chain, Soneium, Lisk).

import { type Address, addressSchema } from "@ethernauta/core"
import { parse } from "valibot"

export const GAS_PRICE_ORACLE_PREDEPLOY: Address = parse(
  addressSchema,
  "0x420000000000000000000000000000000000000F",
)
