/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_107 = {
  "name": "Nebula Testnet",
  "shortName": "ntn",
  "chain": "NTN",
  "icon": "nebulatestnet",
  "rpc": [
    "https://testnet.rpc.novanetwork.io"
  ],
  "faucets": [
    "https://faucet.novanetwork.io"
  ],
  "nativeCurrency": {
    "name": "Nebula X",
    "symbol": "NBX",
    "decimals": 18
  },
  "infoURL": "https://novanetwork.io",
  "chainId": 107,
  "networkId": 107,
  "slip44": 1,
  "explorers": [
    {
      "name": "nebulatestnet",
      "url": "https://explorer.novanetwork.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain