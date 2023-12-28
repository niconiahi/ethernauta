/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_338 = {
  "name": "Cronos Testnet",
  "shortName": "tcro",
  "chain": "CRO",
  "rpc": [
    "https://evm-t3.cronos.org"
  ],
  "faucets": [
    "https://cronos.org/faucet"
  ],
  "nativeCurrency": {
    "name": "Cronos Test Coin",
    "symbol": "TCRO",
    "decimals": 18
  },
  "infoURL": "https://cronos.org",
  "chainId": 338,
  "networkId": 338,
  "slip44": 1,
  "explorers": [
    {
      "name": "Cronos Testnet Explorer",
      "url": "https://explorer.cronos.org/testnet",
      "standard": "none"
    }
  ]
} satisfies Chain