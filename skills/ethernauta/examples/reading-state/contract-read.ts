// Read-only contract calls. Generated methods return pure Callable
// descriptors `{chain_id, to, data, decode}`; `create_read` resolves
// transports per chain and executes the eth_call.
// Taken from the animatronik dapp's showcase loader.

import { eip155_11155111 } from "@ethernauta/chain"
import { addressSchema } from "@ethernauta/eth"
import {
  contract,
  create_read,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import {
  hex_to_number,
  number_to_hex,
} from "@ethernauta/utils"
import { parse } from "valibot"

// Generated contract methods — one file per ABI entry.
// `method(args)(contract({...}))` returns a Callable<T> descriptor:
// pure data with `{chain_id, to, data, decode}`. Nothing fires until
// the descriptor is passed to `read` or `multicall`.
import { balanceOf } from "~/generated/animatronik/methods/balance-of"
import { totalSupply } from "~/generated/animatronik/methods/total-supply"
import { tokenByIndex } from "~/generated/animatronik/methods/token-by-index"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const read = create_read([
  {
    chainId: CHAIN_ID,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
    ],
  },
])

// `to` is the contract address. Validated here, not inside the method.
const to = parse(
  addressSchema,
  "0x0000000000000000000000000000000000000000",
)

// No-arg view function.
const supply_hex = await read(
  totalSupply()(contract({ chain_id: CHAIN_ID, to })),
)
const supply = hex_to_number(supply_hex)

// View with one arg — named-object form.
const owner =
  "0x636c0fcd6da2207abfa80427b556695a4ad0af94" as const
const balance_hex = await read(
  balanceOf({ owner })(
    contract({ chain_id: CHAIN_ID, to }),
  ),
)

// View with one arg — positional-tuple form.
const first_token_id = await read(
  tokenByIndex([number_to_hex(0)])(
    contract({ chain_id: CHAIN_ID, to }),
  ),
)

console.log({ supply, balance_hex, first_token_id })
