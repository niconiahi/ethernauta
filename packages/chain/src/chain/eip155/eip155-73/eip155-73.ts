/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_73 = {
  "name": "FNCY",
  "shortName": "FNCY",
  "chain": "FNCY",
  "icon": "fncy",
  "rpc": [
    "https://fncy-seed1.fncy.world"
  ],
  "faucets": [
    "https://faucet-testnet.fncy.world"
  ],
  "nativeCurrency": {
    "name": "FNCY",
    "symbol": "FNCY",
    "decimals": 18
  },
  "infoURL": "https://fncyscan.fncy.world",
  "chainId": 73,
  "networkId": 73,
  "explorers": [
    {
      "name": "fncy scan",
      "url": "https://fncyscan.fncy.world",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain