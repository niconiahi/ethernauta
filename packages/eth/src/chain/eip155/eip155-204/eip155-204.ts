/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_204 = {
  "name": "opBNB Mainnet",
  "shortName": "obnb",
  "chain": "opBNB",
  "icon": "bnbchain",
  "rpc": [
    "https://opbnb-mainnet-rpc.bnbchain.org",
    "https://opbnb-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3",
    "wss://opbnb-mainnet.nodereal.io/ws/v1/64a9df0874fb4a93b9d0a3849de012d3",
    "https://opbnb-mainnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
    "wss://opbnb-mainnet.nodereal.io/ws/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
    "https://opbnb.publicnode.com",
    "wss://opbnb.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "BNB",
    "decimals": 18
  },
  "infoURL": "https://opbnb.bnbchain.org/en",
  "chainId": 204,
  "networkId": 204,
  "slip44": 714,
  "explorers": [
    {
      "name": "opbnbscan",
      "url": "https://mainnet.opbnbscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain