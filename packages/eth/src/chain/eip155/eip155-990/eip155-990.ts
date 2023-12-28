/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_990 = {
  "name": "eLiberty Mainnet",
  "shortName": "ELm",
  "chain": "$EL",
  "icon": "eLiberty",
  "rpc": [
    "https://rpc.eliberty.ngo"
  ],
  "faucets": [
    "https://faucet.eliberty.ngo"
  ],
  "nativeCurrency": {
    "name": "eLiberty",
    "symbol": "$EL",
    "decimals": 18
  },
  "infoURL": "https://eliberty.ngo",
  "chainId": 990,
  "networkId": 990,
  "explorers": [
    {
      "name": "eLiberty Mainnet",
      "url": "https://explorer.eliberty.ngo",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain