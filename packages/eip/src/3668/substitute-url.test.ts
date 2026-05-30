import {
  AddressSchema,
  BytesSchema,
} from "@ethernauta/core"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { substitute_url } from "./substitute-url"

const SENDER_CHECKSUMMED = parse(
  AddressSchema,
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
)
const CALL_DATA = parse(BytesSchema, "0xdeadbeefcafe")

describe("substitute-url.ts", () => {
  it("lowercases {sender} per the spec", () => {
    const url = substitute_url(
      "https://gw.example.com/{sender}/lookup",
      SENDER_CHECKSUMMED,
      CALL_DATA,
    )
    expect(url).toBe(
      "https://gw.example.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/lookup",
    )
  })

  it("substitutes {data} verbatim (already 0x-hex)", () => {
    const url = substitute_url(
      "https://gw.example.com/lookup?d={data}",
      SENDER_CHECKSUMMED,
      CALL_DATA,
    )
    expect(url).toBe(
      "https://gw.example.com/lookup?d=0xdeadbeefcafe",
    )
  })

  it("substitutes both placeholders together", () => {
    const url = substitute_url(
      "https://gw.example.com/{sender}/lookup/{data}",
      SENDER_CHECKSUMMED,
      CALL_DATA,
    )
    expect(url).toBe(
      "https://gw.example.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/lookup/0xdeadbeefcafe",
    )
  })

  it("leaves templates without placeholders untouched (POST URLs)", () => {
    const url = substitute_url(
      "https://gw.example.com/lookup",
      SENDER_CHECKSUMMED,
      CALL_DATA,
    )
    expect(url).toBe("https://gw.example.com/lookup")
  })

  it("repeats placeholder substitution if the template uses it twice", () => {
    const url = substitute_url(
      "https://{sender}.example.com/{sender}",
      SENDER_CHECKSUMMED,
      CALL_DATA,
    )
    expect(url).toBe(
      "https://0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.example.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    )
  })
})
