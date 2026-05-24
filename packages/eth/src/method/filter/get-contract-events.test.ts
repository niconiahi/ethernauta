import { address, uint256 } from "@ethernauta/abi"
import type {
  Call,
  Http,
  ResolvedReader,
  Response,
} from "@ethernauta/transport"
import {
  array,
  object,
  parse,
  string,
  unknown as unknownSchema,
} from "valibot"
import { describe, expect, it } from "vitest"

import { get_contract_events } from "./get-contract-events"

// Build a fake Http transport returning a canned RPC response,
// and capture the outgoing call so tests can assert on the
// generated filter (topic list, block range, address).
function fake_transport(_result: unknown): {
  http: Http
  captured: { call: Call | undefined }
} {
  const captured: { call: Call | undefined } = {
    call: undefined,
  }
  const http: Http = async (call) => {
    captured.call = call
    const response: Response = {
      jsonrpc: "2.0",
      id: "test",
      result: _result,
    }
    return response
  }
  return { http, captured }
}

const filterParamsSchema = array(
  object({
    address: string(),
    topics: array(unknownSchema()),
  }),
)

const CONTRACT =
  "0xcccccccccccccccccccccccccccccccccccccccc" as const
const FROM = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
const TO = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
const TRANSFER_TOPIC0 =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
const FROM_PADDED =
  "0x000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
const TO_PADDED =
  "0x000000000000000000000000bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
const ONE_ETH_DATA =
  "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000"

const LOG_FIXTURE = {
  removed: false,
  logIndex: "0x0",
  transactionIndex: "0x0",
  transactionHash: `0x${"a".repeat(64)}`,
  blockHash: `0x${"b".repeat(64)}`,
  blockNumber: "0x1",
  address: CONTRACT,
  data: ONE_ETH_DATA,
  topics: [TRANSFER_TOPIC0, FROM_PADDED, TO_PADDED],
}

describe("get_contract_events", () => {
  it("issues eth_getLogs with the computed topic[0] and decodes results", async () => {
    const { http, captured } = fake_transport([LOG_FIXTURE])
    const resolved: ResolvedReader = [
      [http],
      { chain_id: "eip155:1" },
    ]
    const logs = await get_contract_events({
      address: CONTRACT,
      name: "Transfer",
      args: [address(), address(), uint256()] as const,
      indexed: [true, true, false],
      fromBlock: "0x0",
      toBlock: "0x1",
    })(resolved)

    expect(captured.call).toBeDefined()
    if (!captured.call) return
    expect(captured.call[0]).toBe("eth_getLogs")
    const params = parse(filterParamsSchema, captured.call[1])
    expect(params[0]?.address).toBe(CONTRACT)
    expect(params[0]?.topics).toEqual([TRANSFER_TOPIC0])

    expect(logs).toHaveLength(1)
    expect(logs[0]?.name).toBe("Transfer")
    expect(logs[0]?.args).toEqual([FROM, TO, ONE_ETH_DATA])
  })

  it("forwards indexed value filters into the topic list", async () => {
    const { http, captured } = fake_transport([])
    const resolved: ResolvedReader = [
      [http],
      { chain_id: "eip155:1" },
    ]
    await get_contract_events({
      address: CONTRACT,
      name: "Transfer",
      args: [address(), address(), uint256()] as const,
      indexed: [true, true, false],
      fromBlock: "0x0",
      toBlock: "0x1",
      values: [FROM],
    })(resolved)

    const params = parse(filterParamsSchema, captured.call?.[1])
    expect(params[0]?.topics).toEqual([
      TRANSFER_TOPIC0,
      FROM_PADDED,
    ])
  })
})
