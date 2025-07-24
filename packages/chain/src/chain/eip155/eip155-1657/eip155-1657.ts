/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1657 = {
  "name": "Btachain",
  "shortName": "bta",
  "chain": "btachain",
  "rpc": [
    "https://dataseed1.btachain.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin Asset",
    "symbol": "BTA",
    "decimals": 18
  },
  "infoURL": "https://bitcoinasset.io/",
  "chainId": 1657,
  "networkId": 1657
} satisfies Chain