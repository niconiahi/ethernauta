/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1662 = {
  "name": "Liquichain",
  "shortName": "Liquichain",
  "chain": "LQC",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Licoin",
    "symbol": "LCN",
    "decimals": 18
  },
  "infoURL": "https://liquichain.io/",
  "chainId": 1662,
  "networkId": 1662,
  "explorers": [
    {
      "name": "Liquichain Mainnet",
      "url": "https://mainnet.liquichain.io",
      "standard": "EIP3091"
    }
  ],
  "redFlags": [
    "reusedChainId"
  ]
} satisfies Chain