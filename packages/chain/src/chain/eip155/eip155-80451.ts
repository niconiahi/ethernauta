/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_80451 = {
  "name": "Geo Genesis",
  "shortName": "geo",
  "chain": "Geo Genesis",
  "rpc": [
    "https://rpc-geo-genesis-h0q2s21xx8.t.conduit.xyz/"
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
    "name": "The Graph",
    "symbol": "GRT",
    "decimals": 18
  },
  "infoURL": "https://geobrowser.io",
  "chainId": 80451,
  "networkId": 80451,
  "explorers": [],
  "parent": {
    "type": "L2",
    "chain": "eip155-42161"
  }
} satisfies Chain