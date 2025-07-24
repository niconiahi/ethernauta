/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5167003 = {
  "name": "MXC Wannsee zkEVM Testnet",
  "shortName": "MXC",
  "chain": "MXC zkEVM",
  "icon": "mxc",
  "rpc": [
    "https://wannsee-rpc.mxc.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MXC Wannsee zkEVM Testnet",
    "symbol": "MXC",
    "decimals": 18
  },
  "infoURL": "https://wannsee.mxc.com/docs/intro",
  "chainId": 5167003,
  "networkId": 5167003,
  "slip44": 1,
  "explorers": [
    {
      "name": "MXC Wannsee zkEVM Testnet",
      "url": "https://wannsee-explorer.mxc.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain