/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_114 = {
  "name": "Flare Testnet Coston2",
  "shortName": "c2flr",
  "chain": "FLR",
  "icon": "coston2",
  "rpc": [
    "https://coston2-api.flare.network/ext/bc/C/rpc"
  ],
  "faucets": [
    "https://coston2-faucet.towolabs.com"
  ],
  "nativeCurrency": {
    "name": "Coston2 Flare",
    "symbol": "C2FLR",
    "decimals": 18
  },
  "infoURL": "https://flare.xyz",
  "chainId": 114,
  "networkId": 114,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://coston2-explorer.flare.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain