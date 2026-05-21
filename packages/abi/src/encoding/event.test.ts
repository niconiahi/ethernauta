import { describe, expect, it } from "vitest"

import { address, string_, uint256 } from "../leaves"
import {
  decode_event_log,
  encode_event_topics,
  event_topic_hash,
} from "./event"

describe("event_topic_hash", () => {
  it("matches the canonical ERC-20 Transfer topic0", () => {
    const t = event_topic_hash("Transfer", [
      address(),
      address(),
      uint256(),
    ])
    expect(t).toBe(
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    )
  })

  it("matches the canonical ERC-20 Approval topic0", () => {
    const t = event_topic_hash("Approval", [
      address(),
      address(),
      uint256(),
    ])
    expect(t).toBe(
      "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
    )
  })
})

describe("encode_event_topics", () => {
  it("emits only topic0 when no indexed values are specified", () => {
    const topics = encode_event_topics({
      name: "Transfer",
      args: [address(), address(), uint256()],
      indexed: [true, true, false],
    })
    expect(topics).toEqual([
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    ])
  })

  it("pads an indexed address as topic[1]", () => {
    const topics = encode_event_topics({
      name: "Transfer",
      args: [address(), address(), uint256()],
      indexed: [true, true, false],
      values: [
        "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
      ],
    })
    expect(topics).toEqual([
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      "0x000000000000000000000000636c0fcd6da2207abfa80427b556695a4ad0af94",
    ])
  })

  it("inserts a null wildcard between specified topics", () => {
    const topics = encode_event_topics({
      name: "Transfer",
      args: [address(), address(), uint256()],
      indexed: [true, true, false],
      values: [
        null,
        "0x636c0fcd6da2207abfa80427b556695a4ad0af94",
      ],
    })
    expect(topics).toEqual([
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      null,
      "0x000000000000000000000000636c0fcd6da2207abfa80427b556695a4ad0af94",
    ])
  })

  it("hashes indexed string into the topic slot", () => {
    // keccak256("hello") in lowercase hex.
    const topics = encode_event_topics({
      name: "Note",
      args: [string_()],
      indexed: [true],
      values: ["hello"],
    })
    expect(topics[0]).toBe(
      event_topic_hash("Note", [string_()]),
    )
    expect(topics[1]).toBe(
      "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8",
    )
  })

  it("omits topic0 for an anonymous event", () => {
    const topics = encode_event_topics({
      name: "Anon",
      args: [address()],
      indexed: [true],
      values: ["0x636c0fcd6da2207abfa80427b556695a4ad0af94"],
      anonymous: true,
    })
    expect(topics).toEqual([
      "0x000000000000000000000000636c0fcd6da2207abfa80427b556695a4ad0af94",
    ])
  })
})

describe("decode_event_log", () => {
  it("decodes an ERC-20 Transfer log", () => {
    const result = decode_event_log({
      name: "Transfer",
      args: [address(), address(), uint256()],
      indexed: [true, true, false],
      topics: [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "0x000000000000000000000000bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      ],
      data: "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
    })
    expect(result.name).toBe("Transfer")
    expect(result.args).toEqual([
      "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
    ])
  })

  it("returns the topic hash for indexed reference types", () => {
    const string_hash =
      "0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8"
    const topic0 = event_topic_hash("Note", [string_()])
    const result = decode_event_log({
      name: "Note",
      args: [string_()],
      indexed: [true],
      topics: [topic0, string_hash],
      data: "0x",
    })
    expect(result.args).toEqual([string_hash])
  })

  it("supports anonymous events (no topic0)", () => {
    const result = decode_event_log({
      name: "Anon",
      args: [address(), uint256()],
      indexed: [true, false],
      topics: [
        "0x000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      ],
      data: "0x000000000000000000000000000000000000000000000000000000000000002a",
      anonymous: true,
    })
    expect(result.args).toEqual([
      "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "0x000000000000000000000000000000000000000000000000000000000000002a",
    ])
  })
})
