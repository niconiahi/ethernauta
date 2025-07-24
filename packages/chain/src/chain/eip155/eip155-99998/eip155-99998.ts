/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_99998 = {
  "name": "UB Smart Chain(testnet)",
  "shortName": "usctest",
  "chain": "USC",
  "rpc": [
    "https://testnet.rpc.uschain.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "UBC",
    "symbol": "UBC",
    "decimals": 18
  },
  "infoURL": "https://www.ubchain.site",
  "chainId": 99998,
  "networkId": 99998,
  "slip44": 1
} satisfies Chain