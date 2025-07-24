/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8181 = {
  "name": "Testnet BeOne Chain",
  "shortName": "tBOC",
  "chain": "tBOC",
  "icon": "beonechain",
  "rpc": [
    "https://pre-boc1.beonechain.com"
  ],
  "faucets": [
    "https://testnet.beonescan.com/faucet"
  ],
  "nativeCurrency": {
    "name": "Testnet BeOne Chain",
    "symbol": "tBOC",
    "decimals": 18
  },
  "infoURL": "https://testnet.beonescan.com",
  "chainId": 8181,
  "networkId": 8181,
  "slip44": 1,
  "explorers": [
    {
      "name": "Testnet BeOne Chain",
      "url": "https://testnet.beonescan.com",
      "standard": "none"
    }
  ]
} satisfies Chain