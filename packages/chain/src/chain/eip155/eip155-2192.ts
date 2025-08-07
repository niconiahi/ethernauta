/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2192 = {
  "name": "SnaxChain",
  "shortName": "snax",
  "chain": "ETH",
  "icon": "snax",
  "rpc": [
    "https://mainnet.snaxchain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://synthetix.io",
  "chainId": 2192,
  "networkId": 2192,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.snaxchain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain