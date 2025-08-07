/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_41923 = {
  "name": "EDU Chain",
  "shortName": "edu-chain",
  "chain": "EDU Chain",
  "icon": "occ-mainnet",
  "rpc": [
    "https://rpc.edu-chain.raas.gelato.cloud"
  ],
  "faucets": [
    "https://bridge.gelato.network/bridge/edu-chain"
  ],
  "nativeCurrency": {
    "name": "EDU",
    "symbol": "EDU",
    "decimals": 18
  },
  "infoURL": "https://raas.gelato.network/rollups/details/public/edu-chain",
  "chainId": 41923,
  "networkId": 41923,
  "explorers": [
    {
      "name": "EDU Chain",
      "url": "https://educhain.blockscout.com",
      "standard": "none"
    }
  ]
} satisfies Chain