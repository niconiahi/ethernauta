/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_88153591557 = {
  "name": "Arbitrum Blueberry",
  "shortName": "arb-blueberry",
  "title": "Arbitrum Blueberry Testnet",
  "chain": "ETH",
  "rpc": [
    "https://rpc.arb-blueberry.gelato.digital",
    "wss://ws.arb-blueberry.gelato.digital"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GelatoCGT",
    "symbol": "CGT",
    "decimals": 18
  },
  "infoURL": "https://raas.gelato.network/rollups/details/public/arb-blueberry",
  "chainId": 88153591557,
  "networkId": 88153591557,
  "slip44": 60,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://arb-blueberry.gelatoscout.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-421614",
    "bridges": [
      {
        "url": "https://bridge.gelato.network/bridge/arb-blueberry"
      }
    ]
  },
  "status": "active"
} satisfies Chain