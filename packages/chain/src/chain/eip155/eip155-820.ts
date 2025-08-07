/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_820 = {
  "name": "Callisto Mainnet",
  "shortName": "clo",
  "chain": "CLO",
  "icon": "callistonetwork",
  "rpc": [
    "https://rpc.callistodao.org"
  ],
  "faucets": [
    "https://faucet.callistodao.org"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Callisto",
    "symbol": "CLO",
    "decimals": 18
  },
  "infoURL": "https://callistodao.org",
  "chainId": 820,
  "networkId": 1,
  "slip44": 820,
  "explorers": [
    {
      "name": "blockscout-callisto-network",
      "url": "https://explorer.callistodao.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain