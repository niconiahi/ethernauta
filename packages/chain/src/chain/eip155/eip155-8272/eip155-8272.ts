/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8272 = {
  "name": "Blockton Blockchain",
  "shortName": "BTON",
  "chain": "Blockton Blockchain",
  "icon": "bton",
  "rpc": [
    "https://rpc.blocktonscan.com/"
  ],
  "faucets": [
    "https://faucet.blocktonscan.com/"
  ],
  "nativeCurrency": {
    "name": "BLOCKTON",
    "symbol": "BTON",
    "decimals": 18
  },
  "infoURL": "https://blocktoncoin.com",
  "chainId": 8272,
  "networkId": 8272,
  "explorers": [
    {
      "name": "Blockton Explorer",
      "url": "https://blocktonscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain