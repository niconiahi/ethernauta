/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_81 = {
  "name": "Japan Open Chain Mainnet",
  "shortName": "joc",
  "chain": "JOC",
  "icon": "joc",
  "rpc": [
    "https://rpc-1.japanopenchain.org:8545",
    "https://rpc-2.japanopenchain.org:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Japan Open Chain Token",
    "symbol": "JOC",
    "decimals": 18
  },
  "infoURL": "https://www.japanopenchain.org/",
  "chainId": 81,
  "networkId": 81,
  "explorers": [
    {
      "name": "Block Explorer",
      "url": "https://explorer.japanopenchain.org",
      "standard": "EIP3091"
    }
  ],
  "redFlags": [
    "reusedChainId"
  ]
} satisfies Chain