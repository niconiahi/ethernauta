import { describe, expect, it } from "vitest"
import {
  // compile,
  dedupe_imports,
  get_schemas,
  type Import,
  remove_parenthesis,
} from "./compiler"

// import { array, parse } from "valibot"
// import { DescriptionSchema } from "./description"

describe("compiler.ts", () => {
  // it("should run", () => {
  //   const descriptions = parse(
  //     array(DescriptionSchema),
  //     ERC20_ABI,
  //   )
  //   compile(descriptions, "./erc/20")
  // })

  it("should dedupe two equal imports", () => {
    const imports: Set<Import> = new Set([
      { schema: "addressSchema", type: "Address" },
      { schema: "addressSchema", type: "Address" },
    ])
    const deduped = dedupe_imports(imports)
    expect(deduped).toHaveLength(1)
  })

  it("should dedupe three equal imports", () => {
    const imports: Set<Import> = new Set([
      { schema: "addressSchema", type: "Address" },
      { schema: "addressSchema", type: "Address" },
      { schema: "addressSchema", type: "Address" },
    ])
    const deduped = dedupe_imports(imports)
    expect(deduped).toHaveLength(1)
  })

  it("should dedupe 2 different imports", () => {
    const imports: Set<Import> = new Set([
      { schema: "hash32Schema", type: "Hash32" },
      { schema: "addressSchema", type: "Address" },
      { schema: "addressSchema", type: "Address" },
    ])
    const deduped = dedupe_imports(imports)
    expect(deduped).toHaveLength(2)
  })

  it("should remove the parenthesis from a list of valibot schemas", () => {
    const imports: Set<Import> = new Set([
      { schema: "boolean()", type: "boolean" },
    ])
    const expected = remove_parenthesis(
      get_schemas(imports),
    )
    expect(expected).toContain("boolean")
  })
})
