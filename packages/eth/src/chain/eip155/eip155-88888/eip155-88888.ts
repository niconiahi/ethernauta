/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_88888 = {
  "name": "IVAR Chain Mainnet",
  "shortName": "ivar",
  "chain": "IVAR",
  "icon": "ivar",
  "rpc": [
    "https://mainnet-rpc.ivarex.com"
  ],
  "faucets": [
    "https://faucet.ivarex.com/"
  ],
  "nativeCurrency": {
    "name": "Ivar",
    "symbol": "IVAR",
    "decimals": 18
  },
  "infoURL": "https://ivarex.com",
  "chainId": 88888,
  "networkId": 88888,
  "explorers": [
    {
      "name": "ivarscan",
      "url": "https://ivarscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain