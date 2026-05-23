import { describe, expect, it } from "vitest"
import {
  chain_disconnected,
  disconnected,
  ERROR_CODE,
  invalid_params,
  provider_error,
  unauthorized,
  unrecognized_chain,
  unsupported_method,
  user_rejected,
} from "./error"

describe("error.ts", () => {
  it("should expose canonical 1193 + 1474 codes", () => {
    expect(ERROR_CODE.USER_REJECTED_REQUEST).toBe(4001)
    expect(ERROR_CODE.UNAUTHORIZED).toBe(4100)
    expect(ERROR_CODE.UNSUPPORTED_METHOD).toBe(4200)
    expect(ERROR_CODE.DISCONNECTED).toBe(4900)
    expect(ERROR_CODE.CHAIN_DISCONNECTED).toBe(4901)
    expect(ERROR_CODE.UNRECOGNIZED_CHAIN).toBe(4902)
    expect(ERROR_CODE.INVALID_PARAMS).toBe(-32602)
  })

  it("should build an Error with code and message", () => {
    const err = provider_error(4001, "nope")
    expect(err).toBeInstanceOf(Error)
    expect(err.code).toBe(4001)
    expect(err.message).toBe("nope")
    expect(err.data).toBeUndefined()
  })

  it("should attach data when provided", () => {
    const err = provider_error(4902, "x", {
      chainId: "0x1",
    })
    expect(err.data).toEqual({ chainId: "0x1" })
  })

  it("should build the user_rejected helper", () => {
    const err = user_rejected()
    expect(err.code).toBe(4001)
    expect(err.message).toBe("User rejected request")
  })

  it("should build unauthorized", () => {
    expect(unauthorized().code).toBe(4100)
  })

  it("should format unsupported_method", () => {
    const err = unsupported_method("eth_foo")
    expect(err.code).toBe(4200)
    expect(err.message).toBe(
      "method not supported: eth_foo",
    )
  })

  it("should build disconnected", () => {
    expect(disconnected().code).toBe(4900)
  })

  it("should build chain_disconnected", () => {
    expect(chain_disconnected().code).toBe(4901)
  })

  it("should build unrecognized_chain with chainId data", () => {
    const err = unrecognized_chain("0xaa36a7")
    expect(err.code).toBe(4902)
    expect(err.data).toEqual({ chainId: "0xaa36a7" })
  })

  it("should build invalid_params", () => {
    expect(invalid_params("bad").code).toBe(-32602)
  })
})
