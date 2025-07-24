/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1339 = {
  "name": "Elysium Mainnet",
  "shortName": "ELSM",
  "title": "An L1, carbon-neutral, tree-planting, metaverse dedicated blockchain created by VulcanForged",
  "chain": "Elysium",
  "rpc": [
    "https://rpc.elysiumchain.tech/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "LAVA",
    "symbol": "LAVA",
    "decimals": 18
  },
  "infoURL": "https://elysiumscan.vulcanforged.com",
  "chainId": 1339,
  "networkId": 1339,
  "explorers": [
    {
      "name": "Elysium mainnet explorer",
      "url": "https://explorer.elysiumchain.tech",
      "standard": "none"
    }
  ]
} satisfies Chain