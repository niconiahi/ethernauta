/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_51712 = {
  "name": "Sardis Mainnet",
  "shortName": "SRDXm",
  "chain": "SRDX",
  "icon": "sardis",
  "rpc": [
    "https://mainnet-rpc.sardisnetwork.com"
  ],
  "faucets": [
    "https://faucet.sardisnetwork.com"
  ],
  "nativeCurrency": {
    "name": "Sardis",
    "symbol": "SRDX",
    "decimals": 18
  },
  "infoURL": "https://mysardis.com",
  "chainId": 51712,
  "networkId": 51712,
  "explorers": [
    {
      "name": "Sardis",
      "url": "https://contract-mainnet.sardisnetwork.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain