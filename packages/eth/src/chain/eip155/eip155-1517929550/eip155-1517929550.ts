/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1517929550 = {
  "name": "SKALE Titan Hub Testnet",
  "shortName": "titan-testnet",
  "chain": "staging-aware-chief-gianfar",
  "icon": "titan",
  "rpc": [
    "https://staging-v3.skalenodes.com/v1/staging-aware-chief-gianfar",
    "wss://staging-v3.skalenodes.com/v1/ws/staging-aware-chief-gianfar"
  ],
  "faucets": [
    "https://sfuel.dirtroad.dev/staging"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 1517929550,
  "networkId": 1517929550,
  "slip44": 1,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://staging-aware-chief-gianfar.explorer.staging-v3.skalenodes.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain