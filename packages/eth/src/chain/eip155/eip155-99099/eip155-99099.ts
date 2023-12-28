/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_99099 = {
  "name": "eLiberty Testnet",
  "shortName": "ELt",
  "chain": "$EL",
  "icon": "eLiberty",
  "rpc": [
    "https://testnet-rpc.eliberty.ngo"
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
  "chainId": 99099,
  "networkId": 99099,
  "slip44": 1,
  "explorers": [
    {
      "name": "eLiberty Testnet",
      "url": "https://testnet.eliberty.ngo",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain