/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1868 = {
  "name": "Soneium",
  "shortName": "soneium",
  "title": "Soneium mainnet",
  "chain": "ETH",
  "rpc": [
    "https://rpc.soneium.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://soneium.org",
  "chainId": 1868,
  "networkId": 1868,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://soneium.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "OKLink",
      "url": "https://www.okx.com/web3/explorer/soneium",
      "standard": "EIP3091"
    },
    {
      "name": "SlamVision",
      "url": "https://soneium.slam.vision",
      "standard": "none"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://superbridge.app/soneium"
      }
    ]
  },
  "status": "active"
} satisfies Chain