/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8087 = {
  "name": "E-Dollar",
  "shortName": "E-Dollar",
  "chain": "USD",
  "rpc": [
    "https://rpc.e-dollar.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "E-Dollar",
    "symbol": "USD",
    "decimals": 18
  },
  "infoURL": "https://e-dollar.org",
  "chainId": 8087,
  "networkId": 8087,
  "explorers": []
} satisfies Chain