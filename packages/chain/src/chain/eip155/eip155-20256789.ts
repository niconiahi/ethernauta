/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_20256789 = {
  "name": "ETP Mainnet",
  "shortName": "ETP",
  "chain": "ETP",
  "icon": "etpchain",
  "rpc": [
    "https://rpc.etpscan.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ETP Chain Native Token",
    "symbol": "ETP",
    "decimals": 18
  },
  "infoURL": "https://www.etposchain.com",
  "chainId": 20256789,
  "networkId": 20256789,
  "explorers": [
    {
      "name": "ETPScan",
      "url": "https://etpscan.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain