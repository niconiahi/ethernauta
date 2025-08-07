/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_11822 = {
  "name": "Artela Testnet",
  "shortName": "Artela",
  "chain": "Artela",
  "rpc": [
    "https://betanet-rpc1.artela.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ART",
    "symbol": "ART",
    "decimals": 18
  },
  "infoURL": "https://artela.network/",
  "chainId": 11822,
  "networkId": 11822,
  "explorers": [
    {
      "name": "ArtelaScan",
      "url": "https://betanet-scan.artela.network",
      "standard": "EIP3091"
    },
    {
      "name": "OKXExplorer",
      "url": "https://www.okx.com/web3/explorer/artela-testnet",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain