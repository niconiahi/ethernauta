/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_6900 = {
  "name": "Nibiru cataclysm-1",
  "shortName": "cataclysm-1",
  "chain": "Nibiru",
  "icon": "nibiru",
  "rpc": [
    "https://evm-rpc.nibiru.fi"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "NIBI",
    "symbol": "NIBI",
    "decimals": 18
  },
  "infoURL": "https://nibiru.fi",
  "chainId": 6900,
  "networkId": 6900,
  "explorers": []
} satisfies Chain