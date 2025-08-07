/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_12781 = {
  "name": "Playdapp Testnet",
  "shortName": "PDA-TESTNET",
  "chain": "PDA",
  "icon": "pda",
  "rpc": [
    "https://subnets.avax.network/playdappte/testnet/rpc"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Playdapp",
    "symbol": "PDA",
    "decimals": 18
  },
  "infoURL": "https://playdapp.io",
  "chainId": 12781,
  "networkId": 12781,
  "explorers": [
    {
      "name": "Playdapp Testnet Explorer",
      "url": "https://subnets-test.avax.network/playdappte",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain