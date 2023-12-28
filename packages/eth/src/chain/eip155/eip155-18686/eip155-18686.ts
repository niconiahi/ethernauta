/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_18686 = {
  "name": "MXC zkEVM Mainnet",
  "shortName": "MXCzkEVM",
  "chain": "MXC zkEVM",
  "icon": "mxczkevm",
  "rpc": [
    "https://rpc.mxc.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MXC zkEVM Mainnet",
    "symbol": "MXC",
    "decimals": 18
  },
  "infoURL": "https://doc.mxc.com/docs/intro",
  "chainId": 18686,
  "networkId": 18686,
  "explorers": [
    {
      "name": "MXC zkEVM Mainnet",
      "url": "https://explorer.mxc.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain