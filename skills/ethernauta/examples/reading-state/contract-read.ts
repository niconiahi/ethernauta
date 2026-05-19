// Read-only contract calls via Callable methods and create_contract.
// Taken from the animatronik dapp's showcase loader.

import { eip155_11155111 } from "@ethernauta/chain"
import { addressSchema } from "@ethernauta/eth"
import {
  create_contract,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { hex_to_number, number_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

// Generated contract methods — one file per ABI entry.
// They are Callable<T>: they take [Http[], { chain_id, to }].
import { balanceOf } from "~/generated/animatronik/methods/balance-of"
import { totalSupply } from "~/generated/animatronik/methods/total-supply"
import { tokenByIndex } from "~/generated/animatronik/methods/token-by-index"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const contract = create_contract([
  {
    chainId: CHAIN_ID,
    transports: [http("https://ethereum-sepolia-rpc.publicnode.com")],
  },
])

// `to` is the contract address. Validated here, not inside the method.
const to = parse(
  addressSchema,
  "0x0000000000000000000000000000000000000000",
)

// No-arg view function.
const supply_hex = await totalSupply()(
  contract({ chain_id: CHAIN_ID, to }),
)
const supply = hex_to_number(supply_hex)

// View with one arg — named-object form.
const owner = "0x636c0fcd6da2207abfa80427b556695a4ad0af94" as const
const balance_hex = await balanceOf({ owner })(
  contract({ chain_id: CHAIN_ID, to }),
)

// View with one arg — positional-tuple form.
const first_token_id = await tokenByIndex([number_to_hex(0)])(
  contract({ chain_id: CHAIN_ID, to }),
)

console.log({ supply, balance_hex, first_token_id })
