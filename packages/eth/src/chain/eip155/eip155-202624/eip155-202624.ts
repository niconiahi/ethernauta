/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_202624 = {
  "name": "Jellie",
  "shortName": "twl-jellie",
  "title": "Twala Testnet Jellie",
  "chain": "ETH",
  "icon": "twala",
  "rpc": [
    "https://jellie-rpc.twala.io/",
    "wss://jellie-rpc-wss.twala.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Twala Coin",
    "symbol": "TWL",
    "decimals": 18
  },
  "infoURL": "https://twala.io/",
  "chainId": 202624,
  "networkId": 202624,
  "slip44": 1,
  "explorers": [
    {
      "name": "Jellie Blockchain Explorer",
      "url": "https://jellie.twala.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain