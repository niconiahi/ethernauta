/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_175 = {
  "name": "OTC",
  "shortName": "OTC",
  "chain": "OTC",
  "icon": "otc",
  "rpc": [
    "https://rpc.otc.run",
    "wss://rpc.otc.run"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OTC",
    "symbol": "OTC",
    "decimals": 18
  },
  "infoURL": "https://otc.network",
  "chainId": 175,
  "networkId": 175,
  "slip44": 511
} satisfies Chain