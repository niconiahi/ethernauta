/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_503129905 = {
  "name": "SKALE Nebula Hub Testnet",
  "shortName": "nebula-testnet",
  "chain": "staging-faint-slimy-achird",
  "icon": "nebula",
  "rpc": [
    "https://staging-v3.skalenodes.com/v1/staging-faint-slimy-achird",
    "wss://staging-v3.skalenodes.com/v1/ws/staging-faint-slimy-achird"
  ],
  "faucets": [
    "https://sfuel.dirtroad.dev/staging"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://nebulachain.io/",
  "chainId": 503129905,
  "networkId": 503129905,
  "slip44": 1,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://staging-faint-slimy-achird.explorer.staging-v3.skalenodes.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain