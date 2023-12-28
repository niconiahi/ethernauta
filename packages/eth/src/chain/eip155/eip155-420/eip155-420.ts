/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_420 = {
  "name": "Optimism Goerli Testnet",
  "shortName": "ogor",
  "chain": "ETH",
  "rpc": [
    "https://goerli.optimism.io",
    "https://optimism-goerli.publicnode.com",
    "wss://optimism-goerli.publicnode.com",
    "https://optimism-goerli.gateway.tenderly.co",
    "wss://optimism-goerli.gateway.tenderly.co"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://optimism.io",
  "chainId": 420,
  "networkId": 420,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://optimism-goerli.blockscout.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain