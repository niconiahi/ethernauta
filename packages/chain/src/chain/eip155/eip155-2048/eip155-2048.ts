/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2048 = {
  "name": "Stratos",
  "shortName": "stos-mainnet",
  "chain": "STOS",
  "rpc": [
    "https://web3-rpc.thestratos.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "STOS",
    "symbol": "STOS",
    "decimals": 18
  },
  "infoURL": "https://www.thestratos.org",
  "chainId": 2048,
  "networkId": 2048,
  "explorers": [
    {
      "name": "Stratos EVM Explorer (Blockscout)",
      "url": "https://web3-explorer.thestratos.org",
      "standard": "none"
    },
    {
      "name": "Stratos Cosmos Explorer (BigDipper)",
      "url": "https://explorer.thestratos.org",
      "standard": "none"
    }
  ]
} satisfies Chain