/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_21000000 = {
  "name": "Corn",
  "shortName": "corn",
  "chain": "BTCN",
  "icon": "corn",
  "rpc": [
    "https://mainnet.corn-rpc.com",
    "https://rpc.ankr.com/corn_maizenet",
    "https://maizenet-rpc.usecorn.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcorn",
    "symbol": "BTCN",
    "decimals": 18
  },
  "infoURL": "https://usecorn.com",
  "chainId": 21000000,
  "networkId": 21000000,
  "explorers": [
    {
      "name": "Corn Explorer",
      "url": "https://cornscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "Corn Blockscout",
      "url": "https://maizenet-explorer.usecorn.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  }
} satisfies Chain