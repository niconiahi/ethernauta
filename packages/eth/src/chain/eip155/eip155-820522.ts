/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_820522 = {
  "name": "TSC Testnet",
  "shortName": "tTSC",
  "chain": "Trust Smart Chain Testnet",
  "icon": "netx",
  "rpc": [
    "https://testnet.tscscan.io/testrpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TAS",
    "symbol": "tTAS",
    "decimals": 18
  },
  "infoURL": "https://www.trias.one",
  "chainId": 820522,
  "networkId": 820025,
  "explorers": [
    {
      "name": "tscscan",
      "url": "https://testnet.tscscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain