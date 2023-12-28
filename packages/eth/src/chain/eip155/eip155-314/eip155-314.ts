/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_314 = {
  "name": "Filecoin - Mainnet",
  "shortName": "filecoin",
  "chain": "FIL",
  "icon": "filecoin",
  "rpc": [
    "https://api.node.glif.io/",
    "https://rpc.ankr.com/filecoin",
    "https://filecoin-mainnet.chainstacklabs.com/rpc/v1",
    "https://filfox.info/rpc/v1"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "filecoin",
    "symbol": "FIL",
    "decimals": 18
  },
  "infoURL": "https://filecoin.io",
  "chainId": 314,
  "networkId": 314,
  "slip44": 461,
  "explorers": [
    {
      "name": "Filfox",
      "url": "https://filfox.info/en",
      "standard": "none"
    },
    {
      "name": "Beryx",
      "url": "https://beryx.zondax.ch",
      "standard": "none"
    },
    {
      "name": "Glif Explorer",
      "url": "https://explorer.glif.io",
      "standard": "EIP3091"
    },
    {
      "name": "Dev.storage",
      "url": "https://dev.storage",
      "standard": "none"
    },
    {
      "name": "Filscan",
      "url": "https://filscan.io",
      "standard": "none"
    },
    {
      "name": "Filscout",
      "url": "https://filscout.io/en",
      "standard": "none"
    }
  ]
} satisfies Chain