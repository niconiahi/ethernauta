// https://specs.optimism.io/protocol/exec-engine.html#l1-cost-fees-l1-fee-vault
// L1 data-fee component of an OP-stack transaction. Calls
// `GasPriceOracle.getL1Fee(bytes)` on the predeploy with the
// unsigned EIP-1559 RLP for the transaction the user intends to
// submit. Output is the wei the L2 will charge for posting the
// transaction's calldata to L1.

import { BytesSchema, type Uint256 } from "@ethernauta/core"
import {
  encode_transaction_unsigned,
  Transaction1559UnsignedSchema,
} from "@ethernauta/eip/1559"
import { eth_call } from "@ethernauta/eth"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

import {
  GAS_PRICE_ORACLE_ADDRESS,
  getL1Fee,
} from "../predeploys/gas-price-oracle"

export const EstimateL1FeeParametersSchema = object({
  tx: Transaction1559UnsignedSchema,
})
export type EstimateL1FeeParameters = InferOutput<
  typeof EstimateL1FeeParametersSchema
>

export function estimate_l1_fee(
  _parameters: EstimateL1FeeParameters,
): Readable<Uint256> {
  return async (
    resolved: ResolvedReader,
  ): Promise<Uint256> => {
    const parameters = parse(
      EstimateL1FeeParametersSchema,
      _parameters,
    )
    const unsigned_bytes = encode_transaction_unsigned(
      parameters.tx,
    )
    const data_hex = parse(
      BytesSchema,
      bytes_to_hex(unsigned_bytes),
    )
    const callable = getL1Fee({ _data: data_hex })({
      chain_id: resolved[1].chain_id,
      to: GAS_PRICE_ORACLE_ADDRESS,
    })
    const result = await eth_call([
      {
        to: GAS_PRICE_ORACLE_ADDRESS,
        input: callable.data,
      },
    ])(resolved)
    return callable.decode(result)
  }
}
