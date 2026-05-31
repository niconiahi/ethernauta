import { eip155_8453 } from "@ethernauta/chain/eip155-8453"
import { create_testing_reader } from "@ethernauta/testing"
import type { Call, Response } from "@ethernauta/transport"
import { encode_chain_id } from "@ethernauta/transport"
import { describe, expect, it } from "vitest"

import { optimism_rollupConfig } from "./optimism-rollup-config"

function stub_with_capture<T>(response_result: T): {
  transport: (_call: Call) => Promise<Response>
  last_call: { value: Call | null }
} {
  const last_call: { value: Call | null } = { value: null }
  const transport = async (
    _call: Call,
  ): Promise<Response> => {
    last_call.value = _call
    return {
      id: "test",
      jsonrpc: "2.0",
      result: response_result,
    }
  }
  return { transport, last_call }
}

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_8453.chainId,
})
const testing_reader = create_testing_reader({
  chain_id: CHAIN_ID,
})

describe("optimism_rollupConfig", () => {
  it("emits the method with no params and parses RollupConfig", async () => {
    // Shape modeled on a real Base mainnet response — uint64s
    // as JSON numbers, addresses + bytes32 / bytes8 as hex.
    const { transport, last_call } = stub_with_capture({
      genesis: {
        l1: {
          hash: "0x5c13d307623a926cd31415036c8b7fa14572f9dac64528e857a470511fc30771",
          number: 17481768,
        },
        l2: {
          hash: "0xf712aa9241cc24369b143cf6dce85f0902a9731e70d66818a3a5845b296c73dd",
          number: 0,
        },
        l2_time: 1686789347,
        system_config: {
          batcherAddr:
            "0x5050f69a9786f081509234f1a7f4684b5e5b76c9",
          overhead:
            "0x00000000000000000000000000000000000000000000000000000000000000bc",
          scalar:
            "0x00000000000000000000000000000000000000000000000000000000000a6fe0",
          gasLimit: 60000000,
        },
      },
      block_time: 2,
      max_sequencer_drift: 600,
      seq_window_size: 3600,
      channel_timeout: 300,
      l1_chain_id: 1,
      l2_chain_id: 8453,
      regolith_time: 0,
      canyon_time: 1704992401,
      delta_time: 1708560000,
      ecotone_time: 1710374401,
      fjord_time: 1720627201,
      granite_time: 1726070401,
      holocene_time: 1736445601,
      batch_inbox_address:
        "0xff00000000000000000000000000000000008453",
      deposit_contract_address:
        "0x49048044d57e1c92a77f79988d21fa8faf74e97e",
      l1_system_config_address:
        "0x73a79fab69143498ed3712e519a88a918e1f4072",
    })
    const resolved = testing_reader(transport)
    const config = await optimism_rollupConfig()(resolved)
    expect(last_call.value).toEqual([
      "optimism_rollupConfig",
    ])
    expect(config.l2_chain_id).toBe(8453)
    expect(config.block_time).toBe(2)
    expect(config.genesis.l2_time).toBe(1686789347)
    expect(config.genesis.system_config.gasLimit).toBe(
      60000000,
    )
    expect(config.fjord_time).toBe(1720627201)
    expect(config.holocene_time).toBe(1736445601)
    expect(config.isthmus_time).toBeUndefined()
  })
})
