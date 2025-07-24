/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_7332 = {
  "name": "Horizen EON Mainnet",
  "shortName": "EON",
  "chain": "EON",
  "icon": "eon",
  "rpc": [
    "https://eon-rpc.horizenlabs.io/ethv1",
    "https://rpc.ankr.com/horizen_eon"
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
    "name": "Zencash",
    "symbol": "ZEN",
    "decimals": 18
  },
  "infoURL": "https://horizen.io/",
  "chainId": 7332,
  "networkId": 7332,
  "slip44": 121,
  "explorers": [
    {
      "name": "Horizen EON Block Explorer",
      "url": "https://eon-explorer.horizenlabs.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain