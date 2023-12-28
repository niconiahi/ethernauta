/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_421613 = {
  "name": "Arbitrum Goerli",
  "shortName": "arb-goerli",
  "title": "Arbitrum Goerli Rollup Testnet",
  "chain": "ETH",
  "rpc": [
    "https://goerli-rollup.arbitrum.io/rpc",
    "https://arbitrum-goerli.publicnode.com",
    "wss://arbitrum-goerli.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Arbitrum Goerli Ether",
    "symbol": "AGOR",
    "decimals": 18
  },
  "infoURL": "https://arbitrum.io/",
  "chainId": 421613,
  "networkId": 421613,
  "slip44": 1,
  "explorers": [
    {
      "name": "Arbitrum Goerli Arbiscan",
      "url": "https://goerli.arbiscan.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io/"
      }
    ]
  }
} satisfies Chain