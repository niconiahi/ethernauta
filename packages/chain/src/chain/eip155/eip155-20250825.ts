/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_20250825 = {
  "name": "Vcitychain Mainnet",
  "shortName": "vcity",
  "chain": "Vcitychain",
  "icon": "vcitychain",
  "rpc": [
    "https://mainnet-rpc.vcity.app"
  ],
  "faucets": [],
  "features": [],
  "nativeCurrency": {
    "name": "Vcity Coin",
    "symbol": "VCITY",
    "decimals": 18
  },
  "infoURL": "https://vcity.app",
  "chainId": 20250825,
  "networkId": 20250825,
  "explorers": [
    {
      "name": "Vcitychain Explorer",
      "url": "https://blockchain.vcity.app",
      "standard": "none"
    }
  ]
} satisfies Chain