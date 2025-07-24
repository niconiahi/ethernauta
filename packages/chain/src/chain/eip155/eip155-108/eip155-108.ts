/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_108 = {
  "name": "ThunderCore Mainnet",
  "shortName": "TT",
  "chain": "TT",
  "rpc": [
    "https://mainnet-rpc.thundercore.com",
    "https://mainnet-rpc.thundertoken.net",
    "https://mainnet-rpc.thundercore.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ThunderCore Token",
    "symbol": "TT",
    "decimals": 18
  },
  "infoURL": "https://thundercore.com",
  "chainId": 108,
  "networkId": 108,
  "slip44": 1001,
  "explorers": [
    {
      "name": "thundercore-viewblock",
      "url": "https://viewblock.io/thundercore",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain