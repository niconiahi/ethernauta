/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1351057110 = {
  "name": "Chaos (SKALE Testnet)",
  "shortName": "chaos-tenet",
  "title": "Chaos Testnet",
  "chain": "staging-fast-active-bellatrix",
  "rpc": [
    "https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix"
  ],
  "faucets": [
    "https://sfuel.skale.network/staging/chaos"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://docs.skale.network/develop/",
  "chainId": 1351057110,
  "networkId": 1351057110,
  "slip44": 1,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://staging-fast-active-bellatrix.explorer.staging-v3.skalenodes.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain