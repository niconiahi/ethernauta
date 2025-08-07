/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2716446429837000 = {
  "name": "DCHAIN",
  "shortName": "dchainmainnet",
  "title": "DCHAIN Mainnet",
  "chain": "dchainmainnet",
  "icon": "dchainmainnet",
  "rpc": [
    "https://dchain-2716446429837000-1.jsonrpc.sagarpc.io"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.dchain.foundation/",
  "chainId": 2716446429837000,
  "networkId": 2716446429837000,
  "explorers": [
    {
      "name": "dchain scan",
      "url": "https://dchain-2716446429837000-1.sagaexplorer.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain