/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_10508 = {
  "name": "Numbers Testnet",
  "shortName": "Snow",
  "chain": "NUM",
  "icon": "num",
  "rpc": [
    "https://testnetrpc.num.network"
  ],
  "faucets": [
    "https://faucet.avax.network/?subnet=num",
    "https://faucet.num.network"
  ],
  "nativeCurrency": {
    "name": "NUM Token",
    "symbol": "NUM",
    "decimals": 18
  },
  "infoURL": "https://numbersprotocol.io",
  "chainId": 10508,
  "networkId": 10508,
  "slip44": 1,
  "explorers": [
    {
      "name": "ethernal",
      "url": "https://testnet.num.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain