/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_5102 = {
  "name": "SIC Testnet",
  "shortName": "sic-testnet",
  "chain": "SIC Testnet",
  "rpc": [
    "https://rpc-sic-testnet-zvr7tlkzsi.t.conduit.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.fwb.help/",
  "chainId": 5102,
  "networkId": 5102,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorerl2new-sic-testnet-zvr7tlkzsi.t.conduit.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain