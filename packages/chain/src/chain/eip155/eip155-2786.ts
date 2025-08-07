/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2786 = {
  "name": "Apertum",
  "shortName": "aptm",
  "title": "Apertum",
  "chain": "APTM",
  "icon": "apertum",
  "rpc": [
    "https://rpc.apertum.io/ext/bc/YDJ1r9RMkewATmA7B35q1bdV18aywzmdiXwd9zGBq3uQjsCnn/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Apertum",
    "symbol": "APTM",
    "decimals": 18
  },
  "infoURL": "https://apertum.io",
  "chainId": 2786,
  "networkId": 2786,
  "explorers": [
    {
      "name": "Apertum Explorer",
      "url": "https://explorer.apertum.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain