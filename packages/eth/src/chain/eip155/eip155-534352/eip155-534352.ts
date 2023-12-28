/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_534352 = {
  "name": "Scroll",
  "shortName": "scr",
  "chain": "ETH",
  "rpc": [
    "https://rpc.scroll.io",
    "https://rpc-scroll.icecreamswap.com",
    "https://rpc.ankr.com/scroll",
    "https://scroll-mainnet.chainstacklabs.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://scroll.io",
  "chainId": 534352,
  "networkId": 534352,
  "explorers": [
    {
      "name": "Scrollscan",
      "url": "https://scrollscan.com",
      "standard": "EIP3091"
    },
    {
      "name": "Blockscout",
      "url": "https://blockscout.scroll.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://scroll.io/bridge"
      }
    ]
  },
  "status": "active"
} satisfies Chain