// Phase 3 / Phase 6 exit criterion + M3 coverage.
// Demonstrates both paths from M3 working against an anvil
// node spawned for this suite:
//
//   path 2 (no wallet)
//     http(anvil()) composed into create_reader([...])
//     eth_blockNumber round-trips.
//
//   path 1 (wallet-shape)
//     create_provider(create_testing_provider(anvil())) → { reader, signer }
//     eth_sendTransaction (wallet signs) and
//     eth_signTransaction + eth_sendRawTransaction
//     (primitive composition) both succeed.
//
// The call shape on path 1 is identical to a dapp consuming a
// 1193-discovered wallet — only the provider construction
// (`create_provider(create_testing_provider(anvil()))` vs an injected provider) differs.

import {
  BytesSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import {
  create_provider,
  http,
  ResponseSchema,
} from "@ethernauta/transport"
import { parse } from "valibot"
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "vitest"

import { await_ready } from "../spawner/await-ready"
import { pick_free_port } from "../spawner/pick-free-port"
import type { SpawnHandle } from "../spawner/spawn-anvil"
import { spawn_anvil } from "../spawner/spawn-anvil"

import { anvil_account } from "./accounts"
import { create_testing_provider } from "./create-testing-provider"
import {
  clear_endpoint,
  clear_mnemonic,
  DEFAULT_ANVIL_MNEMONIC,
  set_endpoint,
  set_mnemonic,
} from "./endpoint-store"
import { anvil } from "./test"

const is_enabled = process.env.ETHERNAUTA_TEST_ANVIL === "1"

describe.skipIf(!is_enabled)(
  "anvil() — M3 coverage on a live node",
  () => {
    let handle: SpawnHandle

    beforeAll(async () => {
      const port = await pick_free_port()
      handle = spawn_anvil({
        port,
        extra_args: ["--silent"],
      })
      await await_ready({ handle, timeout_ms: 10_000 })
      set_endpoint(`http://127.0.0.1:${port}`)
      set_mnemonic(DEFAULT_ANVIL_MNEMONIC)
    })

    afterAll(() => {
      clear_endpoint()
      clear_mnemonic()
      handle.kill()
    })

    it("path 2: http(anvil()) answers eth_blockNumber", async () => {
      const transport = http(anvil())
      const response = await transport([
        "eth_blockNumber",
        [],
      ])
      const body = parse(ResponseSchema, response)
      if ("error" in body)
        throw new Error(body.error.message)
      const block_number = parse(UintSchema, body.result)
      expect(block_number.startsWith("0x")).toBe(true)
    })

    it("path 1: create_provider(create_testing_provider(anvil())).signer signs an eth_sendTransaction", async () => {
      const resolver = create_provider(
        create_testing_provider(anvil()),
      )
      const account = anvil_account(0)
      const account_one = anvil_account(1)
      const [signer] = resolver.signer({
        chain_id: "eip155:31337",
      })
      const hash_string = await signer(
        "eth_sendTransaction",
        [
          {
            from: account.address,
            to: account_one.address,
            value: "0x1",
          },
        ],
      )
      const hash = parse(Hash32Schema, hash_string)
      expect(hash.startsWith("0x")).toBe(true)
    })

    it("path 1: eth_signTransaction + eth_sendRawTransaction round-trip", async () => {
      const resolver = create_provider(
        create_testing_provider(anvil()),
      )
      const account = anvil_account(0)
      const account_one = anvil_account(1)
      const [signer] = resolver.signer({
        chain_id: "eip155:31337",
      })
      const signed_string = await signer(
        "eth_signTransaction",
        [
          {
            from: account.address,
            to: account_one.address,
            value: "0x1",
          },
        ],
      )
      const signed = parse(BytesSchema, signed_string)
      // Broadcast via the writer side; the resolver.reader
      // doubles as the writer transport because both consume
      // the same Http array.
      const [transports] = resolver.reader({
        chain_id: "eip155:31337",
      })
      const tx_hash = await eth_sendRawTransaction([
        signed,
      ])([transports, { chain_id: "eip155:31337" }])
      expect(tx_hash.startsWith("0x")).toBe(true)
    })
  },
)
