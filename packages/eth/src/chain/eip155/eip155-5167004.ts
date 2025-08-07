/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_5167004 = {
  "name": "Moonchain Geneva Testnet",
  "shortName": "MXC",
  "chain": "MXC zkEVM",
  "icon": "mxc",
  "rpc": [
    "https://geneva-rpc.moonchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Moonchain Geneva Testnet",
    "symbol": "MXC",
    "decimals": 18
  },
  "infoURL": "https://doc.mxc.com/docs/intro",
  "chainId": 5167004,
  "networkId": 5167004,
  "slip44": 1,
  "explorers": [
    {
      "name": "Moonchain Geneva Testnet",
      "url": "https://geneva-explorer.moonchain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain