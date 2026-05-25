import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { DescriptionSchema, functionSchema } from "@ethernauta/abi"
import { array, parse } from "valibot"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import {
  classify_file,
  classify_source,
  derive_suffix,
  discover_sibling_modules,
  parse_spec_link,
  pascal_to_kebab,
  read_artifact_abi,
  regenerate,
  route_for,
  signature_key,
} from "./regenerate"

// -----------------------------------------------------------------------------
// Pure helpers — no filesystem.
// -----------------------------------------------------------------------------

describe("pascal_to_kebab", () => {
  it.each([
    ["MetadataURI", "metadata-uri"],
    ["Burnable", "burnable"],
    ["FlashLender", "flash-lender"],
    ["OriginSettler", "origin-settler"],
    ["DestinationSettler", "destination-settler"],
    ["Resolver", "resolver"],
    ["Foo", "foo"],
    ["URIBar", "uri-bar"],
  ])("converts %s to %s", (input, expected) => {
    expect(pascal_to_kebab(input)).toBe(expected)
  })
})

describe("signature_key", () => {
  const total_supply = parse(functionSchema, {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [],
    stateMutability: "view",
  })
  const balance_of = parse(functionSchema, {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [],
    stateMutability: "view",
  })
  const transfer_from = parse(functionSchema, {
    type: "function",
    name: "transferFrom",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  })

  it("computes a zero-input signature", () => {
    expect(signature_key(total_supply)).toBe("totalSupply()")
  })
  it("computes a single-input signature", () => {
    expect(signature_key(balance_of)).toBe("balanceOf(address)")
  })
  it("computes a multi-input signature with mixed types", () => {
    expect(signature_key(transfer_from)).toBe(
      "transferFrom(address,address,uint256)",
    )
  })
})

describe("derive_suffix", () => {
  it.each([
    ["IERC20", "20", ""],
    ["IERC20Burnable", "20", "Burnable"],
    ["IERC1155MetadataURI", "1155", "MetadataURI"],
    ["IOriginSettler", "7683", "OriginSettler"],
    ["IDestinationSettler", "7683", "DestinationSettler"],
    ["IERC137Resolver", "137", "Resolver"],
    ["IFoo", "12345", "Foo"],
    ["IERC5564Announcer", "5564", "Announcer"],
  ])(
    "derive_suffix(%s, %s) → %s",
    (filename, host_number, expected) => {
      expect(derive_suffix(filename, host_number)).toBe(expected)
    },
  )
})

describe("parse_spec_link", () => {
  it("matches a spec link right after the SPDX header", () => {
    const src = [
      "// SPDX-License-Identifier: MIT",
      "// https://eips.ethereum.org/EIPS/eip-20",
      "pragma solidity >=0.4.16;",
      "",
      "interface IERC20 {}",
    ].join("\n")
    expect(parse_spec_link(src)).toBe("20")
  })

  it("matches a spec link mid-header (any line position)", () => {
    const src = [
      "// SPDX-License-Identifier: MIT",
      "// OpenZeppelin Contracts v5.0.0",
      "// https://eips.ethereum.org/EIPS/eip-1155",
      "pragma solidity >=0.8.0;",
    ].join("\n")
    expect(parse_spec_link(src)).toBe("1155")
  })

  it("does NOT match NatSpec triple-slash", () => {
    const src = [
      "/// https://eips.ethereum.org/EIPS/eip-165",
      "interface IFoo {}",
    ].join("\n")
    expect(parse_spec_link(src)).toBeNull()
  })

  it("does NOT match a URL embedded mid-line in a doc comment", () => {
    const src = [
      "// see also https://eips.ethereum.org/EIPS/eip-999 for context",
      "interface IFoo {}",
    ].join("\n")
    expect(parse_spec_link(src)).toBeNull()
  })

  it("returns the FIRST match when multiple spec URLs are present", () => {
    const src = [
      "// https://eips.ethereum.org/EIPS/eip-5805",
      "// https://eips.ethereum.org/EIPS/eip-6372",
      "interface IERC5805 {}",
    ].join("\n")
    expect(parse_spec_link(src)).toBe("5805")
  })

  it("tolerates trailing whitespace after the URL", () => {
    const src = "// https://eips.ethereum.org/EIPS/eip-721   \n"
    expect(parse_spec_link(src)).toBe("721")
  })

  it("does NOT match a non-numeric eip identifier", () => {
    const src = "// https://eips.ethereum.org/EIPS/eip-xyz\n"
    expect(parse_spec_link(src)).toBeNull()
  })

  it("returns null when no spec link is present", () => {
    expect(parse_spec_link("interface IFoo {}")).toBeNull()
  })
})

// -----------------------------------------------------------------------------
// classify_source / classify_file matrix.
// -----------------------------------------------------------------------------

describe("classify_source", () => {
  it("routes when basename starts with I and the file declares an interface", () => {
    const src = "interface IFoo {}"
    expect(classify_source("IFoo", src)).toBe("interface")
  })

  it("throws when basename starts with I but the file declares a contract", () => {
    const src = "contract Foo {}"
    expect(() => classify_source("IFoo", src)).toThrow(
      /IFoo\.sol's basename starts with `I`/,
    )
  })

  it("throws when basename does NOT start with I but the file declares an interface", () => {
    const src = "interface Foo {}"
    expect(() => classify_source("Foo", src)).toThrow(
      /Foo\.sol declares an interface but its basename does not start/,
    )
  })

  it("skips an implementation file (no I-prefix, declares a contract)", () => {
    const src = "contract Foo {}"
    expect(classify_source("Foo", src)).toBe("skip")
  })

  it("throws when both interface and contract are declared", () => {
    const src = ["interface IFoo {}", "contract FooImpl {}"].join("\n")
    expect(() => classify_source("IFoo", src)).toThrow(
      /declares both an `interface` and a `contract`/,
    )
  })

  it("skips a .sol file with no top-level declaration", () => {
    expect(classify_source("Foo", "// just a comment\n")).toBe("skip")
    expect(classify_source("IFoo", "// just a comment\n")).toBe("skip")
  })

  it("skips an IFoo.sol that only declares structs (no interface or contract)", () => {
    const src = "struct Foo { uint256 x; }"
    expect(classify_source("IFoo", src)).toBe("skip")
  })
})

// -----------------------------------------------------------------------------
// Filesystem-bound helpers: build a tmp tree and exercise each cell.
// -----------------------------------------------------------------------------

type FixtureFiles = Record<string, string>

function write_files(root: string, files: FixtureFiles): void {
  for (const [rel, content] of Object.entries(files)) {
    const full = join(root, rel)
    mkdirSync(dirname(full), { recursive: true })
    writeFileSync(full, content)
  }
}

function make_paths(root: string): {
  contracts_dir: string
  forge_out: string
  erc_src: string
} {
  return {
    contracts_dir: join(root, "contracts"),
    forge_out: join(root, "contracts/out"),
    erc_src: join(root, "packages/erc/src"),
  }
}

// Minimal forge artifacts: only the `abi` field matters to the script;
// the script validates with `object({ abi: array(DescriptionSchema) })`.
// Each fixture round-trips through the same schema at module load so a
// typo in a fixture fails immediately, not deep inside a regenerate()
// integration run.

const IERC20_SRC = [
  "// SPDX-License-Identifier: MIT",
  "// https://eips.ethereum.org/EIPS/eip-20",
  "pragma solidity >=0.8.0;",
  "",
  "interface IERC20 {",
  "  function totalSupply() external view returns (uint256);",
  "  function balanceOf(address account) external view returns (uint256);",
  "  function transfer(address to, uint256 value) external returns (bool);",
  "}",
  "",
].join("\n")

const IERC20_ABI = JSON.stringify(
  {
    abi: parse(array(DescriptionSchema), [
      {
        type: "function",
        name: "totalSupply",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "balanceOf",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "transfer",
        inputs: [
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
      },
      {
        type: "event",
        name: "Transfer",
        inputs: [
          { name: "from", type: "address", indexed: true },
          { name: "to", type: "address", indexed: true },
          { name: "value", type: "uint256", indexed: false },
        ],
        anonymous: false,
      },
    ]),
  },
  null,
  2,
)

const IERC20_BURNABLE_SRC = [
  "// SPDX-License-Identifier: MIT",
  "// https://eips.ethereum.org/EIPS/eip-20",
  "pragma solidity >=0.8.0;",
  "",
  "interface IERC20Burnable {",
  "  function totalSupply() external view returns (uint256);", // duplicated host method
  "  function burn(uint256 value) external;",
  "}",
  "",
].join("\n")

const IERC20_BURNABLE_ABI = JSON.stringify(
  {
    abi: parse(array(DescriptionSchema), [
      {
        type: "function",
        name: "totalSupply",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
      },
      {
        type: "function",
        name: "burn",
        inputs: [{ name: "value", type: "uint256" }],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ]),
  },
  null,
  2,
)

const IERC5564_ANNOUNCER_SRC = [
  "// SPDX-License-Identifier: MIT",
  "// https://eips.ethereum.org/EIPS/eip-5564",
  "pragma solidity >=0.8.0;",
  "",
  "interface IERC5564Announcer {",
  "  function announce(uint256 schemeId, address stealthAddress) external;",
  "}",
  "",
].join("\n")

const IERC5564_ANNOUNCER_ABI = JSON.stringify(
  {
    abi: parse(array(DescriptionSchema), [
      {
        type: "function",
        name: "announce",
        inputs: [
          { name: "schemeId", type: "uint256" },
          { name: "stealthAddress", type: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ]),
  },
  null,
  2,
)

const BATCH_EXECUTOR_SRC = [
  "// SPDX-License-Identifier: MIT",
  "pragma solidity >=0.8.0;",
  "",
  "contract BatchExecutor {",
  "  function execute() external {}",
  "}",
  "",
].join("\n")

describe("classify_file (filesystem)", () => {
  let root: string
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "regen-classify-"))
  })
  afterEach(() => {
    rmSync(root, { recursive: true })
  })

  it("returns 'interface' for a valid I-prefixed interface", () => {
    write_files(root, { "contracts/src/IFoo.sol": "interface IFoo {}" })
    expect(classify_file(join(root, "contracts"), "IFoo")).toBe(
      "interface",
    )
  })

  it("returns 'skip' for a non-prefixed contract file", () => {
    write_files(root, {
      "contracts/src/Foo.sol": "contract Foo {}",
    })
    expect(classify_file(join(root, "contracts"), "Foo")).toBe("skip")
  })

  it("throws when an I-prefixed file declares a contract", () => {
    write_files(root, {
      "contracts/src/IFoo.sol": "contract Foo {}",
    })
    expect(() =>
      classify_file(join(root, "contracts"), "IFoo"),
    ).toThrow(/IFoo\.sol's basename starts with `I`/)
  })
})

// -----------------------------------------------------------------------------
// route_for end-to-end.
// -----------------------------------------------------------------------------

describe("route_for", () => {
  let root: string
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "regen-route-"))
  })
  afterEach(() => {
    rmSync(root, { recursive: true })
  })

  it("routes IERC20 as a host", () => {
    write_files(root, { "contracts/src/IERC20.sol": IERC20_SRC })
    const paths = make_paths(root)
    expect(route_for(paths, "IERC20")).toEqual({
      source_file: "IERC20",
      host_number: "20",
      suffix: "",
      out_dir: join(paths.erc_src, "20"),
    })
  })

  it("routes IERC20Burnable as an extension under 20/extensions/burnable", () => {
    write_files(root, {
      "contracts/src/IERC20Burnable.sol": IERC20_BURNABLE_SRC,
    })
    const paths = make_paths(root)
    expect(route_for(paths, "IERC20Burnable")).toEqual({
      source_file: "IERC20Burnable",
      host_number: "20",
      suffix: "Burnable",
      out_dir: join(paths.erc_src, "20", "extensions", "burnable"),
    })
  })

  it("routes IERC1155MetadataURI with kebab-case 'metadata-uri'", () => {
    const src = [
      "// SPDX-License-Identifier: MIT",
      "// https://eips.ethereum.org/EIPS/eip-1155",
      "interface IERC1155MetadataURI {}",
      "",
    ].join("\n")
    write_files(root, {
      "contracts/src/IERC1155MetadataURI.sol": src,
    })
    const paths = make_paths(root)
    const route = route_for(paths, "IERC1155MetadataURI")
    expect(route?.suffix).toBe("MetadataURI")
    expect(route?.out_dir).toBe(
      join(paths.erc_src, "1155", "extensions", "metadata-uri"),
    )
  })

  it("routes IOriginSettler (no IERC prefix) to 7683/extensions/origin-settler", () => {
    const src = [
      "// SPDX-License-Identifier: MIT",
      "// https://eips.ethereum.org/EIPS/eip-7683",
      "interface IOriginSettler {}",
      "",
    ].join("\n")
    write_files(root, {
      "contracts/src/IOriginSettler.sol": src,
    })
    const paths = make_paths(root)
    expect(route_for(paths, "IOriginSettler")?.out_dir).toBe(
      join(paths.erc_src, "7683", "extensions", "origin-settler"),
    )
  })

  it("returns null for a skipped (non-interface) file", () => {
    write_files(root, {
      "contracts/src/BatchExecutor.sol": BATCH_EXECUTOR_SRC,
    })
    expect(route_for(make_paths(root), "BatchExecutor")).toBeNull()
  })

  it("throws when an interface file has no spec link", () => {
    write_files(root, {
      "contracts/src/IFoo.sol": "interface IFoo {}",
    })
    expect(() => route_for(make_paths(root), "IFoo")).toThrow(
      /IFoo\.sol declares an interface but has no/,
    )
  })
})

// -----------------------------------------------------------------------------
// discover_sibling_modules.
// -----------------------------------------------------------------------------

describe("discover_sibling_modules", () => {
  let root: string
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "regen-siblings-"))
  })
  afterEach(() => {
    rmSync(root, { recursive: true })
  })

  it("returns [] for a non-existent directory", () => {
    expect(discover_sibling_modules(join(root, "nope"))).toEqual([])
  })

  it("returns only non-test .ts files, excluding index.ts, sorted", () => {
    write_files(root, {
      "namehash.ts": "export const x = 1\n",
      "registry.ts": "export const y = 2\n",
      "normalize.ts": "export const z = 3\n",
      "index.ts": "// barrel\n",
      "namehash.test.ts": "// test\n",
      "registry.test.ts": "// test\n",
      "PAPER.md": "spec text\n",
      "IERC137.abi.json": "[]\n",
    })
    mkdirSync(join(root, "extensions"))
    mkdirSync(join(root, "methods"))
    expect(discover_sibling_modules(root)).toEqual([
      "namehash",
      "normalize",
      "registry",
    ])
  })
})

// -----------------------------------------------------------------------------
// read_artifact_abi — hard-failure on missing artifact.
// -----------------------------------------------------------------------------

describe("read_artifact_abi", () => {
  let root: string
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "regen-artifact-"))
  })
  afterEach(() => {
    rmSync(root, { recursive: true })
  })

  it("throws with the resolved path when the artifact is missing", () => {
    expect(() =>
      read_artifact_abi(join(root, "out"), "IERC20", "IERC20"),
    ).toThrow(
      /forge artifact not found: .+\/out\/IERC20\.sol\/IERC20\.json/,
    )
  })

  it("returns abi + function-only filtered list", () => {
    write_files(root, {
      "out/IERC20.sol/IERC20.json": IERC20_ABI,
    })
    const { abi, functions } = read_artifact_abi(
      join(root, "out"),
      "IERC20",
      "IERC20",
    )
    expect(abi).toHaveLength(4) // 3 functions + 1 event
    expect(functions).toHaveLength(3)
    expect(functions.map((f) => f.name)).toEqual([
      "totalSupply",
      "balanceOf",
      "transfer",
    ])
  })
})

// -----------------------------------------------------------------------------
// regenerate — integration tests against a fully-built fixture tree.
// -----------------------------------------------------------------------------

function snapshot_tree(root: string): Record<string, string> {
  const out: Record<string, string> = {}
  function walk(dir: string, prefix: string): void {
    if (!existsSync(dir)) return
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name
      const full = join(dir, entry.name)
      if (entry.isDirectory()) walk(full, rel)
      else if (entry.isFile()) out[rel] = readFileSync(full, "utf8")
    }
  }
  walk(root, "")
  return out
}

describe("regenerate (integration)", () => {
  let root: string
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "regen-integ-"))
  })
  afterEach(() => {
    rmSync(root, { recursive: true })
  })

  it("composes the expected host + extension tree (IERC20 + IERC20Burnable)", () => {
    write_files(root, {
      "contracts/src/IERC20.sol": IERC20_SRC,
      "contracts/src/IERC20Burnable.sol": IERC20_BURNABLE_SRC,
      "contracts/out/IERC20.sol/IERC20.json": IERC20_ABI,
      "contracts/out/IERC20Burnable.sol/IERC20Burnable.json":
        IERC20_BURNABLE_ABI,
    })
    const paths = make_paths(root)
    regenerate({ paths, skip_forge_build: true, quiet: true })

    const host_dir = join(paths.erc_src, "20")
    const ext_dir = join(host_dir, "extensions", "burnable")
    expect(existsSync(host_dir)).toBe(true)
    expect(existsSync(ext_dir)).toBe(true)
    expect(existsSync(join(host_dir, "IERC20.abi.json"))).toBe(true)
    expect(
      existsSync(join(ext_dir, "IERC20Burnable.abi.json")),
    ).toBe(true)
    expect(existsSync(join(host_dir, "methods", "index.ts"))).toBe(
      true,
    )
    expect(existsSync(join(ext_dir, "methods", "index.ts"))).toBe(
      true,
    )

    const host_index = readFileSync(
      join(host_dir, "index.ts"),
      "utf8",
    )
    expect(host_index).toContain(
      "// https://eips.ethereum.org/EIPS/eip-20",
    )
    expect(host_index).toContain(`export * from "./methods"`)
    expect(host_index).toContain(
      `export * from "./extensions/burnable"`,
    )

    const ext_index = readFileSync(
      join(ext_dir, "index.ts"),
      "utf8",
    )
    expect(ext_index).toBe(`export * from "./methods"\n`)

    // Burnable's `totalSupply` is inherited from IERC20 — should be
    // subtracted from the extension's method list.
    const burnable_methods = readdirSync(join(ext_dir, "methods"))
    expect(burnable_methods).toContain("index.ts")
    expect(
      burnable_methods.some((f) => f.startsWith("total-supply")),
    ).toBe(false)
    expect(
      burnable_methods.some((f) => f.startsWith("burn")),
    ).toBe(true)
  })

  it("is byte-identical on a second run (idempotent)", () => {
    write_files(root, {
      "contracts/src/IERC20.sol": IERC20_SRC,
      "contracts/src/IERC20Burnable.sol": IERC20_BURNABLE_SRC,
      "contracts/out/IERC20.sol/IERC20.json": IERC20_ABI,
      "contracts/out/IERC20Burnable.sol/IERC20Burnable.json":
        IERC20_BURNABLE_ABI,
    })
    const paths = make_paths(root)
    regenerate({ paths, skip_forge_build: true, quiet: true })
    const first = snapshot_tree(paths.erc_src)
    regenerate({ paths, skip_forge_build: true, quiet: true })
    const second = snapshot_tree(paths.erc_src)
    expect(second).toEqual(first)
  })

  it("processes an implicit-host case (no host .sol, only extensions)", () => {
    write_files(root, {
      "contracts/src/IERC5564Announcer.sol": IERC5564_ANNOUNCER_SRC,
      "contracts/out/IERC5564Announcer.sol/IERC5564Announcer.json":
        IERC5564_ANNOUNCER_ABI,
    })
    const paths = make_paths(root)
    // Pre-existing sibling module the host index.ts should re-export.
    mkdirSync(join(paths.erc_src, "5564"), { recursive: true })
    writeFileSync(
      join(paths.erc_src, "5564", "scheme-1.ts"),
      "export const SCHEME_ID = 1\n",
    )

    regenerate({ paths, skip_forge_build: true, quiet: true })

    const host_index = readFileSync(
      join(paths.erc_src, "5564", "index.ts"),
      "utf8",
    )
    expect(host_index).toContain(
      "// https://eips.ethereum.org/EIPS/eip-5564",
    )
    // Implicit host has no `./methods` re-export.
    expect(host_index).not.toContain(`export * from "./methods"`)
    expect(host_index).toContain(
      `export * from "./extensions/announcer"`,
    )
    expect(host_index).toContain(`export * from "./scheme-1"`)
  })

  it("wipes a stale methods/ folder at an implicit host", () => {
    write_files(root, {
      "contracts/src/IERC5564Announcer.sol": IERC5564_ANNOUNCER_SRC,
      "contracts/out/IERC5564Announcer.sol/IERC5564Announcer.json":
        IERC5564_ANNOUNCER_ABI,
      // Stale from a previous host-as-.sol layout.
      "packages/erc/src/5564/methods/old.ts": "// stale\n",
      "packages/erc/src/5564/methods/index.ts":
        `export * from "./old"\n`,
      "packages/erc/src/5564/IERC5564.abi.json": "[]\n",
    })
    const paths = make_paths(root)
    regenerate({ paths, skip_forge_build: true, quiet: true })

    expect(existsSync(join(paths.erc_src, "5564", "methods"))).toBe(
      false,
    )
    expect(
      existsSync(
        join(paths.erc_src, "5564", "IERC5564.abi.json"),
      ),
    ).toBe(false)
  })

  it("wipes stale *.abi.json before writing the fresh one", () => {
    write_files(root, {
      "contracts/src/IERC20.sol": IERC20_SRC,
      "contracts/out/IERC20.sol/IERC20.json": IERC20_ABI,
      // Stale leftover from an earlier layout that wrote IERC<N>.abi.json.
      "packages/erc/src/20/IERCOld.abi.json": "[]\n",
    })
    const paths = make_paths(root)
    regenerate({ paths, skip_forge_build: true, quiet: true })

    expect(
      existsSync(join(paths.erc_src, "20", "IERCOld.abi.json")),
    ).toBe(false)
    expect(
      existsSync(join(paths.erc_src, "20", "IERC20.abi.json")),
    ).toBe(true)
  })

  it("re-exports newly-added sibling modules at a host folder root", () => {
    write_files(root, {
      "contracts/src/IERC20.sol": IERC20_SRC,
      "contracts/out/IERC20.sol/IERC20.json": IERC20_ABI,
      "packages/erc/src/20/helper.ts": "export const x = 1\n",
    })
    const paths = make_paths(root)
    regenerate({ paths, skip_forge_build: true, quiet: true })

    const host_index = readFileSync(
      join(paths.erc_src, "20", "index.ts"),
      "utf8",
    )
    expect(host_index).toContain(`export * from "./helper"`)
  })
})

// -----------------------------------------------------------------------------
// Hard-failure integration tests.
// -----------------------------------------------------------------------------

describe("regenerate (hard-failure paths)", () => {
  let root: string
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "regen-fail-"))
  })
  afterEach(() => {
    rmSync(root, { recursive: true })
  })

  it("throws when a routed file has a missing forge artifact", () => {
    write_files(root, {
      "contracts/src/IERC20.sol": IERC20_SRC,
      // no artifact written
    })
    const paths = make_paths(root)
    expect(() =>
      regenerate({ paths, skip_forge_build: true, quiet: true }),
    ).toThrow(/forge artifact not found:.+IERC20\.sol\/IERC20\.json/)
  })

  it("throws when an I-prefixed file declares a contract (classify_file)", () => {
    write_files(root, {
      "contracts/src/IFoo.sol": [
        "// SPDX-License-Identifier: MIT",
        "// https://eips.ethereum.org/EIPS/eip-999",
        "contract Foo {}",
      ].join("\n"),
    })
    const paths = make_paths(root)
    expect(() =>
      regenerate({ paths, skip_forge_build: true, quiet: true }),
    ).toThrow(/IFoo\.sol's basename starts with `I`/)
  })

  it("throws when an interface file has no spec-link header", () => {
    write_files(root, {
      "contracts/src/IFoo.sol": [
        "// SPDX-License-Identifier: MIT",
        "interface IFoo {}",
      ].join("\n"),
    })
    const paths = make_paths(root)
    expect(() =>
      regenerate({ paths, skip_forge_build: true, quiet: true }),
    ).toThrow(/IFoo\.sol declares an interface but has no/)
  })
})
