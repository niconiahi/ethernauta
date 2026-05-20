import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import {
  deadline_in,
  now_to_big,
  seconds_to_big,
} from "./time"

describe("seconds_to_big", () => {
  it("floors fractional seconds", () => {
    expect(seconds_to_big(1716207600.999)).toBe(
      1716207600n,
    )
  })

  it("passes integer seconds through", () => {
    expect(seconds_to_big(0)).toBe(0n)
    expect(seconds_to_big(3600)).toBe(3600n)
  })
})

describe("clock-based helpers", () => {
  const FAKE_NOW_MS = Date.UTC(2026, 4, 20, 0, 0, 0)
  const FAKE_NOW_S = BigInt(
    Math.floor(FAKE_NOW_MS / 1000),
  )

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(FAKE_NOW_MS))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("now_to_big returns the current unix second", () => {
    expect(now_to_big()).toBe(FAKE_NOW_S)
  })

  it("deadline_in adds the offset to now", () => {
    expect(deadline_in(3600)).toBe(FAKE_NOW_S + 3600n)
  })
})
