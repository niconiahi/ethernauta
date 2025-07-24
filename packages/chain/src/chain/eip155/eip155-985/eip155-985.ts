/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_985 = {
  "name": "Memo Smart Chain Mainnet",
  "shortName": "memochain",
  "chain": "MEMO",
  "icon": "memo",
  "rpc": [
    "https://chain.metamemo.one:8501",
    "wss://chain.metamemo.one:16801"
  ],
  "faucets": [
    "https://faucet.metamemo.one/"
  ],
  "nativeCurrency": {
    "name": "Memo",
    "symbol": "CMEMO",
    "decimals": 18
  },
  "infoURL": "www.memolabs.org",
  "chainId": 985,
  "networkId": 985,
  "explorers": [
    {
      "name": "Memo Mainnet Explorer",
      "url": "https://scan.metamemo.one:8080",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain