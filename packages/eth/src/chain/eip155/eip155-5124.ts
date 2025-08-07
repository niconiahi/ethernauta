/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_5124 = {
  "name": "Seismic devnet",
  "shortName": "seismic-devnet",
  "chain": "Seismic",
  "rpc": [
    "https://node-2.seismicdev.net/rpc"
  ],
  "faucets": [
    "https://faucet-2.seismicdev.net/"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Seismic Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://seismic.systems",
  "chainId": 5124,
  "networkId": 5124,
  "explorers": [
    {
      "name": "Seismic Devnet Explorer",
      "url": "https://explorer-2.seismicdev.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain