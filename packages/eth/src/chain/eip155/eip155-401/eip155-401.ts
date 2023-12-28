/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_401 = {
  "name": "Ozone Chain Testnet",
  "shortName": "ozo_tst",
  "chain": "OZONE",
  "icon": "ozonechain",
  "rpc": [
    "https://node1.testnet.ozonechain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OZONE",
    "symbol": "OZO",
    "decimals": 18
  },
  "infoURL": "https://ozonechain.io",
  "chainId": 401,
  "networkId": 401,
  "slip44": 1,
  "explorers": [
    {
      "name": "OZONE Scan",
      "url": "https://testnet.ozonescan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain