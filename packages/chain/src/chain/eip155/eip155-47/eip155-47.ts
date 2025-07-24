/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_47 = {
  "name": "Acria IntelliChain",
  "shortName": "aic",
  "chain": "AIC",
  "rpc": [
    "https://aic.acria.ai"
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
    "name": "ACRIA",
    "symbol": "ACRIA",
    "decimals": 18
  },
  "infoURL": "https://acria.ai",
  "chainId": 47,
  "networkId": 47,
  "explorers": [
    {
      "name": "Acria IntelliChain-Explorer",
      "url": "https://explorer.acria.ai",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain