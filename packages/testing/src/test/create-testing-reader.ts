// `create_testing_reader()` / `create_testing_writer()`
// produce one-shot factories that wrap a single `Http`
// transport into a `ResolvedReader` / `ResolvedWriter`.
// They remove the boilerplate every method test would
// otherwise repeat:
//
//   const testing_reader = create_testing_reader()
//   await eth_getBalance(address)(testing_reader(fake_transport))
//
// By default the chain_id is "eip155:1". Pass `{ chain_id }`
// to target a specific chain (anvil tests typically pass
// "eip155:31337").

import type {
  Http,
  ResolvedReader,
  ResolvedWriter,
} from "@ethernauta/transport"
import {
  ChainIdSchema,
  create_dispatcher,
  DEFAULT_STRATEGY,
} from "@ethernauta/transport"
import {
  type InferOutput,
  object,
  optional,
  parse,
} from "valibot"

const TestingResolverOptionsSchema = object({
  chain_id: optional(ChainIdSchema),
})
export type TestingResolverOptions = InferOutput<
  typeof TestingResolverOptionsSchema
>

const DEFAULT_CHAIN_ID = "eip155:1"

export function create_testing_reader(
  _options: TestingResolverOptions = {},
): (transport: Http) => ResolvedReader {
  const options = parse(
    TestingResolverOptionsSchema,
    _options,
  )
  const chain_id = options.chain_id ?? DEFAULT_CHAIN_ID
  return (transport) => [
    create_dispatcher([transport], DEFAULT_STRATEGY),
    { chain_id },
  ]
}

export function create_testing_writer(
  _options: TestingResolverOptions = {},
): (transport: Http) => ResolvedWriter {
  const options = parse(
    TestingResolverOptionsSchema,
    _options,
  )
  const chain_id = options.chain_id ?? DEFAULT_CHAIN_ID
  return (transport) => [
    create_dispatcher([transport], DEFAULT_STRATEGY),
    { chain_id },
  ]
}
