/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_6626 = {
  "name": "Pixie Chain Mainnet",
  "shortName": "pixie-chain",
  "chain": "PixieChain",
  "rpc": [
    "https://http-mainnet.chain.pixie.xyz",
    "wss://ws-mainnet.chain.pixie.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Pixie Chain Native Token",
    "symbol": "PIX",
    "decimals": 18
  },
  "infoURL": "https://chain.pixie.xyz",
  "chainId": 6626,
  "networkId": 6626,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.chain.pixie.xyz",
      "standard": "none"
    }
  ]
} satisfies Chain