/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_10242 = {
  "name": "Arthera Mainnet",
  "shortName": "aa",
  "chain": "AA",
  "icon": "arthera",
  "rpc": [
    "https://rpc.arthera.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Arthera",
    "symbol": "AA",
    "decimals": 18
  },
  "infoURL": "https://docs.arthera.net/build/developing-sc/using-hardhat",
  "chainId": 10242,
  "networkId": 10242,
  "slip44": 10242,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.arthera.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain