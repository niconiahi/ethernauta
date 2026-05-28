import { describe, expect, it } from "vitest"

import { detect_foundry } from "./detect-foundry"

describe("detect_foundry", () => {
  it("returns a tagged result whose status is either 'found' or 'missing'", async () => {
    const result = await detect_foundry()
    if (result.status === "found") {
      expect(typeof result.path).toBe("string")
      expect(result.path.length).toBeGreaterThan(0)
    } else {
      expect(result.status).toBe("missing")
    }
  })
})
