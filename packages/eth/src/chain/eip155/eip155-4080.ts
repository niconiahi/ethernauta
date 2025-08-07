/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4080 = {
  "name": "Tobe Chain Testnet",
  "shortName": "tbc",
  "chain": "TBC",
  "icon": "tobe",
  "rpc": [
    "https://rpc-testnet.tobescan.com"
  ],
  "faucets": [
    "https://faucet.tobescan.com/faucet"
  ],
  "nativeCurrency": {
    "name": "Tobe Coin",
    "symbol": "TOBE",
    "decimals": 18
  },
  "infoURL": "https://tobechain.net",
  "chainId": 4080,
  "networkId": 4080,
  "explorers": [
    {
      "name": "tobescan testnet",
      "url": "https://testnet.tobescan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain