/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1688 = {
  "name": "LUDAN Mainnet",
  "shortName": "LUDAN",
  "chain": "LUDAN",
  "icon": "ludan",
  "rpc": [
    "https://rpc.ludan.org/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "LUDAN",
    "symbol": "LUDAN",
    "decimals": 18
  },
  "infoURL": "https://www.ludan.org/",
  "chainId": 1688,
  "networkId": 1688
} satisfies Chain