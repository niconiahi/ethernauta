/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_10823 = {
  "name": "CryptoCoinPay",
  "shortName": "CCP",
  "chain": "CCP",
  "icon": "ccp",
  "rpc": [
    "http://node106.cryptocoinpay.info:8545",
    "ws://node106.cryptocoinpay.info:8546"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CryptoCoinPay",
    "symbol": "CCP",
    "decimals": 18
  },
  "infoURL": "https://www.cryptocoinpay.co",
  "chainId": 10823,
  "networkId": 10823,
  "explorers": [
    {
      "name": "CCP Explorer",
      "url": "https://cryptocoinpay.info",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain