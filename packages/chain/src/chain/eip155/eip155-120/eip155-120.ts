/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_120 = {
  "name": "ENULS Testnet",
  "shortName": "enulst",
  "chain": "ENULS",
  "icon": "enuls",
  "rpc": [
    "https://beta.evmapi.nuls.io",
    "https://beta.evmapi2.nuls.io"
  ],
  "faucets": [
    "http://faucet.nuls.io"
  ],
  "nativeCurrency": {
    "name": "NULS",
    "symbol": "NULS",
    "decimals": 18
  },
  "infoURL": "https://nuls.io",
  "chainId": 120,
  "networkId": 120,
  "slip44": 1,
  "explorers": [
    {
      "name": "enulsscan",
      "url": "https://beta.evmscan.nuls.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain