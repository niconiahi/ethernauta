import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { caip2_namespaceSchema } from "./caip-2/namespace"
import { caip2_referenceSchema } from "./caip-2/reference"

import { encode_chain_id } from "./encode-chain-id"

describe("encode-chain-id.ts", () => {
  it("should correctly parse a encode with valid parameters", async () => {
    const _namespace = "eip155"
    const _reference = "1"
    const namespace = parse(
      caip2_namespaceSchema,
      _namespace,
    )
    const reference = parse(
      caip2_referenceSchema,
      _reference,
    )
    const encoded = encode_chain_id({
      namespace,
      reference,
    })
    expect(encoded).toEqual("eip155:1")
  })
})
