/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_88882 = {
  "name": "Chiliz Spicy Testnet",
  "shortName": "chzspicy",
  "chain": "CHZ",
  "icon": "chilizspicy",
  "rpc": [
    "https://spicy-rpc.chiliz.com"
  ],
  "faucets": [
    "https://spicy-faucet.chiliz.com",
    "https://tatum.io/faucets/chiliz"
  ],
  "nativeCurrency": {
    "name": "Chiliz",
    "symbol": "CHZ",
    "decimals": 18
  },
  "infoURL": "https://www.chiliz.com/en/chain",
  "chainId": 88882,
  "networkId": 88882,
  "slip44": 1,
  "explorers": [
    {
      "name": "spicy-explorer",
      "url": "https://testnet.chiliscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain