/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_10001 = {
  "name": "Smart Bitcoin Cash Testnet",
  "shortName": "smartbchtest",
  "chain": "smartBCHTest",
  "rpc": [
    "https://rpc-testnet.smartbch.org",
    "https://smartbch.devops.cash/testnet"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin Cash Test Token",
    "symbol": "BCHT",
    "decimals": 18
  },
  "infoURL": "http://smartbch.org/",
  "chainId": 10001,
  "networkId": 10001,
  "slip44": 1
} satisfies Chain