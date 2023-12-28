/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_101010 = {
  "name": "Soverun Testnet",
  "shortName": "SVRNt",
  "chain": "SVRN",
  "icon": "soverunTestnet",
  "rpc": [
    "https://testnet-rpc.soverun.com"
  ],
  "faucets": [
    "https://faucet.soverun.com"
  ],
  "nativeCurrency": {
    "name": "Soverun",
    "symbol": "SVRN",
    "decimals": 18
  },
  "infoURL": "https://soverun.com",
  "chainId": 101010,
  "networkId": 101010,
  "slip44": 1,
  "explorers": [
    {
      "name": "Soverun",
      "url": "https://testnet.soverun.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain