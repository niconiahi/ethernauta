/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_743111 = {
  "name": "Hemi Sepolia",
  "shortName": "hemi-sep",
  "chain": "ETH",
  "icon": "hemi",
  "rpc": [
    "https://testnet.rpc.hemi.network/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://hemi.xyz",
  "chainId": 743111,
  "networkId": 743111,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.explorer.hemi.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111"
  },
  "status": "active"
} satisfies Chain