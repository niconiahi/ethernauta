/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_78600 = {
  "name": "Vanguard",
  "shortName": "vanguard",
  "title": "Vanar Testnet Vanguard",
  "chain": "VANAR",
  "icon": "vanguard",
  "rpc": [
    "https://rpc-vanguard.vanarchain.com",
    "wss://ws-vanguard.vanarchain.com"
  ],
  "faucets": [
    "https://faucet.vanarchain.com"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Vanguard Vanry",
    "symbol": "VANRY",
    "decimals": 18
  },
  "infoURL": "https://vanarchain.com",
  "chainId": 78600,
  "networkId": 78600,
  "explorers": [
    {
      "name": "Vanguard Explorer",
      "url": "https://explorer-vanguard.vanarchain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain