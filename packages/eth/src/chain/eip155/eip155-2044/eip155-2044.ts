/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2044 = {
  "name": "Shrapnel Subnet",
  "shortName": "Shrapnel",
  "chain": "shrapnel",
  "rpc": [
    "https://subnets.avax.network/shrapnel/mainnet/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Shrapnel Gas Token",
    "symbol": "SHRAPG",
    "decimals": 18
  },
  "infoURL": "https://www.shrapnel.com/",
  "chainId": 2044,
  "networkId": 2044
} satisfies Chain