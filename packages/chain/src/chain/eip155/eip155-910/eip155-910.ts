/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_910 = {
  "name": "DecentraBone Layer1 Testnet",
  "shortName": "DBONE",
  "chain": "DBONE",
  "rpc": [
    "https://layer1test.decentrabone.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DecentraBone",
    "symbol": "DBONE",
    "decimals": 18
  },
  "infoURL": "https://decentrabone.com",
  "chainId": 910,
  "networkId": 910,
  "slip44": 1
} satisfies Chain