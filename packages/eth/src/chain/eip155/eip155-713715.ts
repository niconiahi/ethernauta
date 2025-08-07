/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_713715 = {
  "name": "Sei Devnet",
  "shortName": "sei-devnet",
  "chain": "Sei",
  "icon": "sei",
  "rpc": [
    "https://evm-rpc-arctic-1.sei-apis.com",
    "https://evm-rpc.arctic-1.seinetwork.io"
  ],
  "faucets": [
    "https://sei-faucet.nima.enterprises",
    "https://sei-evm.faucetme.pro"
  ],
  "nativeCurrency": {
    "name": "Sei",
    "symbol": "SEI",
    "decimals": 18
  },
  "infoURL": "https://www.sei.io",
  "chainId": 713715,
  "networkId": 713715,
  "explorers": [
    {
      "name": "Seistream",
      "url": "https://seistream.app",
      "standard": "none"
    },
    {
      "name": "Seitrace",
      "url": "https://seitrace.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain