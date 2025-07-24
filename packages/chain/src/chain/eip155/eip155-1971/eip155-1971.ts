/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1971 = {
  "name": "Atelier",
  "shortName": "atlr",
  "title": "Atelier Test Network",
  "chain": "ALTR",
  "icon": "atlr",
  "rpc": [
    "https://1971.network/atlr",
    "wss://1971.network/atlr"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ATLR",
    "symbol": "ATLR",
    "decimals": 18
  },
  "infoURL": "https://1971.network/",
  "chainId": 1971,
  "networkId": 1971,
  "slip44": 1
} satisfies Chain