import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { generate } from "./generator"

function make_tmp(): string {
  return mkdtempSync(join(tmpdir(), "ethernauta-gen-"))
}

describe("generator.ts", () => {
  it("should emit a Callable descriptor for view methods", () => {
    const out_dir = make_tmp()
    try {
      generate(
        [
          {
            type: "function",
            name: "get_data",
            inputs: [{ name: "token_id", type: "uint256" }],
            outputs: [{ name: "", type: "string" }],
            stateMutability: "view",
          },
        ],
        out_dir,
      )
      const file = readFileSync(
        join(out_dir, "methods", "get_data.ts"),
        "utf8",
      )
      expect(file).toContain("Callable<string>")
      expect(file).toContain("ContractContext")
      expect(file).toContain("PARAM_CODECS = [uint256()]")
      expect(file).toContain("OUTPUT_CODECS = [string_()]")
      expect(file).toContain('name: "get_data"')
      expect(file).toContain("args: PARAM_CODECS")
      expect(file).toContain("chain_id: context.chain_id")
      expect(file).toContain("to: context.to")
      expect(file).toContain("data: bytes_to_hex(calldata)")
      expect(file).toContain("decode_function_result")
    } finally {
      rmSync(out_dir, { recursive: true, force: true })
    }
  })

  it("should emit a Signable composing onto eth_signTransaction for nonpayable methods", () => {
    const out_dir = make_tmp()
    try {
      generate(
        [
          {
            type: "function",
            name: "mint",
            inputs: [{ name: "data", type: "string" }],
            outputs: [],
            stateMutability: "nonpayable",
          },
        ],
        out_dir,
      )
      const file = readFileSync(
        join(out_dir, "methods", "mint.ts"),
        "utf8",
      )
      expect(file).toContain("Signable<Bytes>")
      expect(file).toContain("ResolvedSigner")
      expect(file).toContain("eth_signTransaction")
      expect(file).toContain('name: "mint"')
      expect(file).toContain("encode_function_call")
      expect(file).toContain("PARAM_CODECS = [string_()]")
    } finally {
      rmSync(out_dir, { recursive: true, force: true })
    }
  })

  it("should emit a no-param Callable for nullary view methods", () => {
    const out_dir = make_tmp()
    try {
      generate(
        [
          {
            type: "function",
            name: "totalSupply",
            inputs: [],
            outputs: [{ name: "", type: "uint256" }],
            stateMutability: "view",
          },
        ],
        out_dir,
      )
      const file = readFileSync(
        join(out_dir, "methods", "total-supply.ts"),
        "utf8",
      )
      expect(file).toContain("Callable<Uint256>")
      expect(file).toContain(
        "export function totalSupply()",
      )
    } finally {
      rmSync(out_dir, { recursive: true, force: true })
    }
  })

  it("should emit a Callable for methods with dynamic T[] inputs and outputs", () => {
    // ERC-1155 balanceOfBatch(address[],uint256[]) -> uint256[]
    const out_dir = make_tmp()
    try {
      generate(
        [
          {
            type: "function",
            name: "balanceOfBatch",
            inputs: [
              { name: "accounts", type: "address[]" },
              { name: "ids", type: "uint256[]" },
            ],
            outputs: [{ name: "", type: "uint256[]" }],
            stateMutability: "view",
          },
        ],
        out_dir,
      )
      const file = readFileSync(
        join(out_dir, "methods", "balance-of-batch.ts"),
        "utf8",
      )
      // valibot `array` collides with abi `array`, so the valibot side is
      // aliased on import as `v_array`. The abi side keeps its plain name.
      expect(file).toContain(
        'array as v_array } from "valibot"',
      )
      expect(file).toContain("array,")
      expect(file).toContain(
        "PARAM_CODECS = [array(address()), array(uint256())] as const",
      )
      expect(file).toContain(
        "OUTPUT_CODECS = [array(uint256())] as const",
      )
      // parametersSchema wraps each leaf schema in v_array(...)
      expect(file).toContain(
        "tuple([v_array(addressSchema), v_array(uint256Schema)])",
      )
      expect(file).toContain(
        "object({ accounts: v_array(addressSchema), ids: v_array(uint256Schema) })",
      )
      // Selector signature: canonical form preserves the [] suffix.
      expect(file).toContain(
        'signature: "balanceOfBatch(address[],uint256[])"',
      )
      // Return type: Uint256[]
      expect(file).toContain("Callable<Uint256[]>")
      // Decode path validates with v_array(uint256Schema).
      expect(file).toContain(
        "parse(v_array(uint256Schema), decoded)",
      )
    } finally {
      rmSync(out_dir, { recursive: true, force: true })
    }
  })

  it("should emit a Signable for methods with a flat tuple (struct) input", () => {
    // ERC-7683 IOriginSettler.open((uint32,bytes32,bytes))
    const out_dir = make_tmp()
    try {
      generate(
        [
          {
            type: "function",
            name: "open",
            inputs: [
              {
                name: "order",
                type: "tuple",
                components: [
                  { name: "fillDeadline", type: "uint32" },
                  {
                    name: "orderDataType",
                    type: "bytes32",
                  },
                  { name: "orderData", type: "bytes" },
                ],
              } as never,
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
        ],
        out_dir,
      )
      const file = readFileSync(
        join(out_dir, "methods", "open.ts"),
        "utf8",
      )
      // abi `tuple` collides with valibot `tuple`, so the abi side is
      // aliased as `abi_tuple` on import.
      expect(file).toContain("tuple as abi_tuple,")
      expect(file).toContain(
        "PARAM_CODECS = [abi_tuple({ fillDeadline: uint32(), orderDataType: bytes32(), orderData: bytes() })] as const",
      )
      // Canonical signature recurses through components into the parenthesized form.
      expect(file).toContain(
        'signature: "open((uint32,bytes32,bytes))"',
      )
      // parametersSchema uses valibot `object` for the struct schema.
      expect(file).toContain(
        "tuple([object({ fillDeadline: uint256Schema, orderDataType: bytes32Schema, orderData: bytesSchema })])",
      )
      expect(file).toContain(
        "object({ order: object({ fillDeadline: uint256Schema, orderDataType: bytes32Schema, orderData: bytesSchema }) })",
      )
      // Object form values extraction uses parameters.<name> by top-level input name.
      expect(file).toContain("[parameters.order]")
      // Signable, not Callable.
      expect(file).toContain("Signable<Bytes>")
    } finally {
      rmSync(out_dir, { recursive: true, force: true })
    }
  })

  it("should emit a Callable for methods returning nested tuple-of-tuple[]", () => {
    // ERC-7683 IOriginSettler.resolve(OnchainCrossChainOrder) -> ResolvedCrossChainOrder
    // The output struct has three tuple[] fields, each with its own components.
    const out_dir = make_tmp()
    try {
      generate(
        [
          {
            type: "function",
            name: "resolve",
            inputs: [
              {
                name: "order",
                type: "tuple",
                components: [
                  { name: "fillDeadline", type: "uint32" },
                  {
                    name: "orderDataType",
                    type: "bytes32",
                  },
                  { name: "orderData", type: "bytes" },
                ],
              } as never,
            ],
            outputs: [
              {
                name: "",
                type: "tuple",
                components: [
                  { name: "user", type: "address" },
                  { name: "orderId", type: "bytes32" },
                  {
                    name: "maxSpent",
                    type: "tuple[]",
                    components: [
                      { name: "token", type: "bytes32" },
                      { name: "amount", type: "uint256" },
                    ],
                  },
                ],
              } as never,
            ],
            stateMutability: "view",
          },
        ],
        out_dir,
      )
      const file = readFileSync(
        join(out_dir, "methods", "resolve.ts"),
        "utf8",
      )
      // Nested tuple[] on the output composes array(abi_tuple({...})).
      expect(file).toContain(
        "OUTPUT_CODECS = [abi_tuple({ user: address(), orderId: bytes32(), maxSpent: array(abi_tuple({ token: bytes32(), amount: uint256() })) })] as const",
      )
      // Return type expands the nested struct shape.
      expect(file).toContain(
        "Callable<{ user: Address; orderId: Bytes32; maxSpent: { token: Bytes32; amount: Uint256 }[] }>",
      )
      // Decode validates with object({...maxSpent: v_array(object({...}))}).
      expect(file).toContain(
        "v_array(object({ token: bytes32Schema, amount: uint256Schema }))",
      )
      // Canonical signature only recurses INPUT components for the selector;
      // the output side doesn't show in the signature string.
      expect(file).toContain(
        'signature: "resolve((uint32,bytes32,bytes))"',
      )
    } finally {
      rmSync(out_dir, { recursive: true, force: true })
    }
  })

  it("should emit a full snapshot for the open(tuple) signable to pin the layout", () => {
    const out_dir = make_tmp()
    try {
      generate(
        [
          {
            type: "function",
            name: "open",
            inputs: [
              {
                name: "order",
                type: "tuple",
                components: [
                  { name: "fillDeadline", type: "uint32" },
                  {
                    name: "orderDataType",
                    type: "bytes32",
                  },
                  { name: "orderData", type: "bytes" },
                ],
              } as never,
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
        ],
        out_dir,
      )
      const file = readFileSync(
        join(out_dir, "methods", "open.ts"),
        "utf8",
      )
      expect(file).toMatchInlineSnapshot(`
        "import type { Bytes } from "@ethernauta/core"
        import { eth_signTransaction } from "@ethernauta/eth"
        import type { ResolvedSigner, Signable } from "@ethernauta/transport"
        import { bytes_to_hex } from "@ethernauta/utils"
        import {
          tuple as abi_tuple,
          bytes,
          bytes32,
          uint32,
          encode_function_call,
        } from "@ethernauta/abi"
        import type { InferOutput } from "valibot"
        import { object, parse, tuple, union } from "valibot"
        import { bytes32Schema, bytesSchema, uint256Schema } from "@ethernauta/core"

        const PARAM_CODECS = [abi_tuple({ fillDeadline: uint32(), orderDataType: bytes32(), orderData: bytes() })] as const

        export const OPEN_SIGNATURE: {
          signature: string
          names: string[]
        } = {
          signature: "open((uint32,bytes32,bytes))",
          names: ["order"],
        }

        const parametersSchema = union([
          tuple([object({ fillDeadline: uint256Schema, orderDataType: bytes32Schema, orderData: bytesSchema })]),
          object({ order: object({ fillDeadline: uint256Schema, orderDataType: bytes32Schema, orderData: bytesSchema }) }),
        ])
        type Parameters = InferOutput<typeof parametersSchema>

        export function open(_parameters: Parameters): Signable<Bytes> {
          return async ([signer, context]: ResolvedSigner): Promise<Bytes> => {
            if (!context.to)
              throw new Error("contract Signable requires a 'to' on the signer resolver")
            const parameters = parse(parametersSchema, _parameters)
            const values = Array.isArray(parameters)
              ? parameters
              : [parameters.order]
            const calldata = encode_function_call({
              name: "open",
              args: PARAM_CODECS,
              values: values as never,
            })
            // TODO(wallet): wallet fills nonce, gas, gasPrice / maxFeePerGas /
            //               maxPriorityFeePerGas by querying the network
            //               (eth_getTransactionCount, eth_estimateGas, eth_feeHistory).
            //               Generator MUST leave these fields unset.
            return eth_signTransaction(
              [{
                to: context.to,
                value: "0x0",
                input: bytes_to_hex(calldata),
                _ethernauta: {
                  function: OPEN_SIGNATURE,
                },
              }],
            )([signer, context])
          }
        }
        "
      `)
    } finally {
      rmSync(out_dir, { recursive: true, force: true })
    }
  })

  it("should emit a full snapshot for the balanceOfBatch(address[],uint256[]) callable", () => {
    const out_dir = make_tmp()
    try {
      generate(
        [
          {
            type: "function",
            name: "balanceOfBatch",
            inputs: [
              { name: "accounts", type: "address[]" },
              { name: "ids", type: "uint256[]" },
            ],
            outputs: [{ name: "", type: "uint256[]" }],
            stateMutability: "view",
          },
        ],
        out_dir,
      )
      const file = readFileSync(
        join(out_dir, "methods", "balance-of-batch.ts"),
        "utf8",
      )
      expect(file).toMatchInlineSnapshot(`
        "import type { Bytes } from "@ethernauta/core"
        import type { Callable, ContractContext } from "@ethernauta/transport"
        import { bytes_to_hex } from "@ethernauta/utils"
        import {
          address,
          array,
          uint256,
          decode_function_result,
          encode_function_call,
        } from "@ethernauta/abi"
        import type { InferOutput } from "valibot"
        import { object, parse, tuple, union, array as v_array } from "valibot"
        import type { Uint256 } from "@ethernauta/core"
        import { addressSchema, uint256Schema } from "@ethernauta/core"

        const PARAM_CODECS = [array(address()), array(uint256())] as const
        const OUTPUT_CODECS = [array(uint256())] as const

        export const BALANCE_OF_BATCH_SIGNATURE: {
          signature: string
          names: string[]
        } = {
          signature: "balanceOfBatch(address[],uint256[])",
          names: ["accounts", "ids"],
        }

        const parametersSchema = union([
          tuple([v_array(addressSchema), v_array(uint256Schema)]),
          object({ accounts: v_array(addressSchema), ids: v_array(uint256Schema) }),
        ])
        type Parameters = InferOutput<typeof parametersSchema>

        export function balanceOfBatch(_parameters: Parameters) {
          return (context: ContractContext): Callable<Uint256[]> => {
            const parameters = parse(parametersSchema, _parameters)
            const values = Array.isArray(parameters)
              ? parameters
              : [parameters.accounts, parameters.ids]
            const calldata = encode_function_call({
              name: "balanceOfBatch",
              args: PARAM_CODECS,
              values: values as never,
            })
            return {
              chain_id: context.chain_id,
              to: context.to,
              data: bytes_to_hex(calldata),
              decode: (result: Bytes): Uint256[] => {
                const [decoded] = decode_function_result(
                  OUTPUT_CODECS,
                  result,
                )
                return parse(v_array(uint256Schema), decoded)
              },
            }
          }
        }
        "
      `)
    } finally {
      rmSync(out_dir, { recursive: true, force: true })
    }
  })
})
