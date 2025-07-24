/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_313 = {
  "name": "Neurochain Mainnet",
  "shortName": "ncn",
  "chain": "NCN",
  "rpc": [
    "https://nc-rpc-prd1.neurochain.io",
    "https://nc-rpc-prd2.neurochain.io"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Neurochain",
    "symbol": "NCN",
    "decimals": 18
  },
  "infoURL": "https://www.neurochain.ai",
  "chainId": 313,
  "networkId": 313,
  "explorers": [
    {
      "name": "neuroscan",
      "url": "https://ncnscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain