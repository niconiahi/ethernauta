/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1339 = {
  "name": "Elysium Mainnet",
  "shortName": "ELY",
  "title": "An L1, carbon-neutral, tree-planting, metaverse dedicated blockchain.",
  "chain": "Elysium",
  "icon": "elysium",
  "rpc": [
    "https://rpc.elysiumchain.tech",
    "https://rpc.elysiumchain.us"
  ],
  "faucets": [
    "https://faucet.elysiumchain.tech"
  ],
  "nativeCurrency": {
    "name": "ELY",
    "symbol": "ELY",
    "decimals": 18
  },
  "infoURL": "https://elysiumchain.tech/",
  "chainId": 1339,
  "networkId": 1339,
  "explorers": [
    {
      "name": "Elysium mainnet explorer",
      "url": "https://explorer.elysiumchain.tech",
      "standard": "EIP3091"
    },
    {
      "name": "Elysium blockscout explorer",
      "url": "https://blockscout.elysiumchain.tech",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain