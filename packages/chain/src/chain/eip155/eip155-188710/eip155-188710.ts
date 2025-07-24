/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_188710 = {
  "name": "Bitica Chain Mainnet",
  "shortName": "bdcc",
  "chain": "BDCC",
  "rpc": [
    "https://mainnet-rpc.biticablockchain.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitica Coin",
    "symbol": "BDCC",
    "decimals": 18
  },
  "infoURL": "https://biticablockchain.com/",
  "chainId": 188710,
  "networkId": 188710,
  "explorers": [
    {
      "name": "Bitica DPOS Blockchain Explorer",
      "url": "https://biticablockchain.com",
      "standard": "none"
    }
  ]
} satisfies Chain