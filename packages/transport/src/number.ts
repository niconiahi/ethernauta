// Some JSON-RPC namespaces emit numeric results as hex strings
// (`"0x2a"`) because their Go signatures use `hexutil.UintN`. Others
// emit JSON numbers (`42`) because the signature is plain `uintN`
// and geth's rpc framework falls back to `encoding/json`. Most
// `eth_*` methods take the hex path; Nitro's consensus-side
// `arb_*` methods take the number path. Bindings shouldn't carry
// that asymmetry. `RpcNumberSchema` accepts either wire shape and
// normalizes to the canonical `Uint` brand (compact `0x...` form).
// Bindings that need a narrower brand re-parse:
//
//   parse(Uint64Schema, parse(RpcNumberSchema, response.result))

import { UintSchema } from "@ethernauta/core"
import {
  number,
  parse,
  pipe,
  string,
  transform,
  union,
} from "valibot"

const WireSchema = union([string(), number()])

export const RpcNumberSchema = pipe(
  WireSchema,
  transform((wire) =>
    parse(UintSchema, `0x${BigInt(wire).toString(16)}`),
  ),
)
