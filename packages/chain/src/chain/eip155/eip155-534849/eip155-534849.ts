/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_534849 = {
  "name": "Shinarium Beta",
  "shortName": "shi",
  "chain": "Shinarium",
  "icon": "shinarium",
  "rpc": [
    "https://rpc.shinarium.org"
  ],
  "faucets": [
    "https://faucet.shinarium.org"
  ],
  "nativeCurrency": {
    "name": "Shina Inu",
    "symbol": "SHI",
    "decimals": 18
  },
  "infoURL": "https://shinarium.org",
  "chainId": 534849,
  "networkId": 534849,
  "explorers": [
    {
      "name": "shinascan",
      "url": "https://shinascan.shinarium.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain