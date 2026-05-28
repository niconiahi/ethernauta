import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  ForkConfigSchema,
  TestConfigSchema,
} from "./config"

describe("ForkConfigSchema", () => {
  it("accepts a valid http url", () => {
    expect(() =>
      parse(ForkConfigSchema, {
        url: "https://sepolia.example.com",
      }),
    ).not.toThrow()
  })

  it("accepts a fork with an optional block_number", () => {
    expect(() =>
      parse(ForkConfigSchema, {
        url: "https://sepolia.example.com",
        block_number: 12345n,
      }),
    ).not.toThrow()
  })

  it("rejects an empty url at the parse boundary", () => {
    expect(() =>
      parse(ForkConfigSchema, { url: "" }),
    ).toThrow()
  })

  it("rejects a syntactically invalid url at the parse boundary", () => {
    expect(() =>
      parse(ForkConfigSchema, { url: "not a url" }),
    ).toThrow()
  })
})

describe("TestConfigSchema — fork slot", () => {
  it("rejects a TestConfig whose fork.url is invalid", () => {
    expect(() =>
      parse(TestConfigSchema, {
        fork: { url: "not a url" },
      }),
    ).toThrow()
  })

  it("accepts a TestConfig with a valid fork", () => {
    expect(() =>
      parse(TestConfigSchema, {
        fork: {
          url: "https://sepolia.example.com",
          block_number: 100n,
        },
      }),
    ).not.toThrow()
  })
})
