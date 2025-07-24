/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_818 = {
  "name": "BeOne Chain Mainnet",
  "shortName": "BOC",
  "chain": "BOC",
  "icon": "beonechain",
  "rpc": [
    "https://dataseed1.beonechain.com",
    "https://dataseed2.beonechain.com",
    "https://dataseed-us1.beonechain.com",
    "https://dataseed-us2.beonechain.com",
    "https://dataseed-uk1.beonechain.com",
    "https://dataseed-uk2.beonechain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BeOne Chain Mainnet",
    "symbol": "BOC",
    "decimals": 18
  },
  "infoURL": "https://beonechain.com",
  "chainId": 818,
  "networkId": 818,
  "slip44": 8181,
  "explorers": [
    {
      "name": "BeOne Chain Mainnet",
      "url": "https://beonescan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain