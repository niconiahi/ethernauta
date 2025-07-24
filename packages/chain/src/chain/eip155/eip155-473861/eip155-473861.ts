/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_473861 = {
  "name": "Ultra Pro Mainnet",
  "shortName": "ultrapro",
  "chain": "ultrapro",
  "icon": "ultrapro",
  "rpc": [
    "https://mainnet-rpc.ultraproscan.io"
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
    "name": "Ultra Pro",
    "symbol": "UPRO",
    "decimals": 18
  },
  "infoURL": "https://ultrapro.info",
  "chainId": 473861,
  "networkId": 473861,
  "explorers": [
    {
      "name": "ultraproscan",
      "url": "https://ultraproscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain