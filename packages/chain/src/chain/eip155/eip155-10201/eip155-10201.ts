/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_10201 = {
  "name": "MaxxChain Mainnet",
  "shortName": "PWR",
  "chain": "MaxxChain",
  "icon": "pwr",
  "rpc": [
    "https://rpc.maxxchain.org",
    "https://rpc1.maxxchain.org",
    "https://rpc2.maxxchain.org"
  ],
  "faucets": [
    "https://faucet.maxxchain.org"
  ],
  "nativeCurrency": {
    "name": "Power",
    "symbol": "PWR",
    "decimals": 18
  },
  "infoURL": "https://www.maxxchain.org/",
  "chainId": 10201,
  "networkId": 10201,
  "explorers": [
    {
      "name": "MaxxChain Block Explorer",
      "url": "https://explorer.maxxchain.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain