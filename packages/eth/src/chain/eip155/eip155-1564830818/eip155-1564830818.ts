/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1564830818 = {
  "name": "SKALE Calypso Hub",
  "shortName": "calypso-mainnet",
  "chain": "honorable-steel-rasalhague",
  "icon": "calypso",
  "rpc": [
    "https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague"
  ],
  "faucets": [
    "https://sfuel.dirtroad.dev"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://calypsohub.network/",
  "chainId": 1564830818,
  "networkId": 1564830818,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain