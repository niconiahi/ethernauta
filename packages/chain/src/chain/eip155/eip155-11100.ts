/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_11100 = {
  "name": "Bool Network Beta Mainnet",
  "shortName": "BOL",
  "chain": "BOOL",
  "icon": "boolnetwork",
  "rpc": [
    "https://beta-rpc-node-http.bool.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BOL",
    "symbol": "BOL",
    "decimals": 18
  },
  "infoURL": "https://bool.network/",
  "chainId": 11100,
  "networkId": 11100
} satisfies Chain