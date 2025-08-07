/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_238 = {
  "name": "Blast Mainnet",
  "shortName": "blast",
  "chain": "ETH",
  "icon": "blastIcon",
  "rpc": [
    "https://zkevmrpc.blastchain.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "One World Chain",
    "symbol": "OWCT",
    "decimals": 18
  },
  "infoURL": "https://docs.blastchain.org",
  "chainId": 238,
  "networkId": 238,
  "explorers": [
    {
      "name": "Blast Mainnet",
      "url": "https://blastchain.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain