/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1001 = {
  "name": "Klaytn Testnet Baobab",
  "shortName": "Baobab",
  "chain": "KLAY",
  "rpc": [
    "https://api.baobab.klaytn.net:8651"
  ],
  "faucets": [
    "https://baobab.wallet.klaytn.com/access?next=faucet"
  ],
  "nativeCurrency": {
    "name": "KLAY",
    "symbol": "KLAY",
    "decimals": 18
  },
  "infoURL": "https://www.klaytn.com/",
  "chainId": 1001,
  "networkId": 1001,
  "slip44": 1,
  "explorers": [
    {
      "name": "klaytnscope",
      "url": "https://scope.klaytn.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain