/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_43111 = {
  "name": "Hemi",
  "shortName": "hemi",
  "chain": "ETH",
  "icon": "hemi",
  "rpc": [
    "https://rpc.hemi.network/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://hemi.xyz",
  "chainId": 43111,
  "networkId": 43111,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.hemi.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  },
  "status": "active"
} satisfies Chain