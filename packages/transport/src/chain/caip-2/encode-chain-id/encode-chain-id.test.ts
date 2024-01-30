import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { caip2_namespaceSchema } from "../namespace"
import { caip2_referenceSchema } from "../reference"

import { encodeChainId } from "./encode-chain-id"

describe("encodeChainId", () => {
  it("should correctly parse a encode with valid parameters", async () => {
    const _namespace = "eip155"
    const _reference = "1"
    const namespace = parse(caip2_namespaceSchema, _namespace)
    const reference = parse(caip2_referenceSchema, _reference)
    const encoded = encodeChainId({ namespace, reference })
    expect(encoded).toEqual("eip155:1")
  })
})
