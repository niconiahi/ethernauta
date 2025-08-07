/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_534352 = {
  "name": "Scroll",
  "shortName": "scr",
  "chain": "ETH",
  "rpc": [
    "https://rpc.scroll.io",
    "https://rpc.ankr.com/scroll",
    "https://scroll-mainnet.chainstacklabs.com",
    "https://scroll-rpc.publicnode.com",
    "wss://scroll-rpc.publicnode.com"
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