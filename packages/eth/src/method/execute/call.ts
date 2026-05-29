import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import {
  CallSchema,
  RpcRequestError,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  check,
  object,
  optional,
  parse,
  pipe,
  record,
  tuple,
  union,
} from "valibot"
import { BlockNumberOrTagOrHashSchema } from "../../core/block"
import { GenericTransactionSchema } from "../../core/transaction"

// Order matters: valibot's `tuple` and `object` accept extra
// trailing / extra-key shapes by default, so the most specific
// variant must come first or the union silently picks a
// shorter shape and drops the rest.
export const EthCallParametersSchema = union([
  tuple([
    GenericTransactionSchema,
    BlockNumberOrTagOrHashSchema,
  ]),
  tuple([GenericTransactionSchema]),
  object({
    transaction: GenericTransactionSchema,
    blockNumberOrTagOrHash: BlockNumberOrTagOrHashSchema,
  }),
  object({ transaction: GenericTransactionSchema }),
])
export type EthCallParameters = InferOutput<
  typeof EthCallParametersSchema
>

// https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-eth#eth-call
// Per-address override applied for the duration of a single
// `eth_call`. `state` fully replaces the account's storage;
// `stateDiff` overlays selected slots — the two are mutually
// exclusive at the spec level.
export const StateOverrideEntrySchema = pipe(
  object({
    balance: optional(UintSchema),
    nonce: optional(UintSchema),
    code: optional(BytesSchema),
    state: optional(record(Bytes32Schema, Bytes32Schema)),
    stateDiff: optional(
      record(Bytes32Schema, Bytes32Schema),
    ),
  }),
  check(
    (entry) =>
      entry.state === undefined ||
      entry.stateDiff === undefined,
    "state and stateDiff are mutually exclusive",
  ),
)
export type StateOverrideEntry = InferOutput<
  typeof StateOverrideEntrySchema
>
export const StateOverrideSchema = record(
  AddressSchema,
  StateOverrideEntrySchema,
)
export type StateOverride = InferOutput<
  typeof StateOverrideSchema
>

export function eth_call(
  _parameters: EthCallParameters,
  _state_override?: StateOverride,
): Readable<Bytes> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Bytes> => {
    const method = "eth_call"
    const parameters = parse(EthCallParametersSchema, _parameters)
    const state_override =
      _state_override === undefined
        ? undefined
        : parse(StateOverrideSchema, _state_override)
    const call = parse(CallSchema, [
      method,
      build_params(parameters, state_override),
    ])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new RpcRequestError(response.error)
    }
    const result = parse(BytesSchema, response.result)
    return result
  }
}

function build_params(
  parameters: EthCallParameters,
  state_override: StateOverride | undefined,
): unknown[] {
  const transaction = Array.isArray(parameters)
    ? parameters[0]
    : parameters.transaction
  const block =
    Array.isArray(parameters)
      ? parameters[1]
      : "blockNumberOrTagOrHash" in parameters
        ? parameters.blockNumberOrTagOrHash
        : undefined
  if (state_override === undefined) {
    return block === undefined
      ? [transaction]
      : [transaction, block]
  }
  return [transaction, block ?? "latest", state_override]
}
