/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_50342 = {
  "name": "Reddio",
  "shortName": "reddio",
  "title": "Reddio mainnet L2 Rollup",
  "chain": "ETH",
  "rpc": [
    "https://mainnet.reddio.com/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Reddio",
    "symbol": "RDO",
    "decimals": 18
  },
  "infoURL": "https://www.reddio.com",
  "chainId": 50342,
  "networkId": 50342,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://reddio.cloud.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  }
} satisfies Chain