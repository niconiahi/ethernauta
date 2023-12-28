/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_6065 = {
  "name": "Tres Testnet",
  "shortName": "TRESTEST",
  "chain": "TresLeches",
  "icon": "tresleches",
  "rpc": [
    "https://rpc-test.tresleches.finance/"
  ],
  "faucets": [
    "http://faucet.tresleches.finance:8080"
  ],
  "nativeCurrency": {
    "name": "TRES",
    "symbol": "TRES",
    "decimals": 18
  },
  "infoURL": "https://treschain.com",
  "chainId": 6065,
  "networkId": 6065,
  "slip44": 1,
  "explorers": [
    {
      "name": "treslechesexplorer",
      "url": "https://explorer-test.tresleches.finance",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain