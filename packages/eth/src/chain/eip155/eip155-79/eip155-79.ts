/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_79 = {
  "name": "Zenith Mainnet",
  "shortName": "zenith",
  "chain": "Zenith",
  "rpc": [
    "https://dataserver-us-1.zenithchain.co/",
    "https://dataserver-asia-3.zenithchain.co/",
    "https://dataserver-asia-4.zenithchain.co/",
    "https://dataserver-asia-2.zenithchain.co/",
    "https://dataserver-asia-5.zenithchain.co/",
    "https://dataserver-asia-6.zenithchain.co/",
    "https://dataserver-asia-7.zenithchain.co/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ZENITH",
    "symbol": "ZENITH",
    "decimals": 18
  },
  "infoURL": "https://www.zenithchain.co/",
  "chainId": 79,
  "networkId": 79,
  "explorers": [
    {
      "name": "zenith scan",
      "url": "https://scan.zenithchain.co",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain