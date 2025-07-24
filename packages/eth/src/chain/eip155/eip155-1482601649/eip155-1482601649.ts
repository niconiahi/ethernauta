/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1482601649 = {
  "name": "SKALE Nebula Hub",
  "shortName": "nebula-mainnet",
  "chain": "green-giddy-denebola",
  "icon": "nebula",
  "rpc": [
    "https://mainnet.skalenodes.com/v1/green-giddy-denebola",
    "wss://mainnet-proxy.skalenodes.com/v1/ws/green-giddy-denebola"
  ],
  "faucets": [
    "https://sfuel.skale.network/"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://nebulachain.io/",
  "chainId": 1482601649,
  "networkId": 1482601649,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://green-giddy-denebola.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain