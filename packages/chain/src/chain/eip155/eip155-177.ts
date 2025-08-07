/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_177 = {
  "name": "HashKey Chain",
  "shortName": "hsk",
  "title": "HashKey Chain",
  "chain": "HashKey Chain",
  "rpc": [
    "https://mainnet.hsk.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "HashKey EcoPoints",
    "symbol": "HSK",
    "decimals": 18
  },
  "infoURL": "https://hsk.xyz",
  "chainId": 177,
  "networkId": 177,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://hashkey.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout",
      "url": "https://explorer.hsk.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  }
} satisfies Chain