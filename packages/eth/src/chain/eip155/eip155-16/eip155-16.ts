/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_16 = {
  "name": "Flare Testnet Coston",
  "shortName": "cflr",
  "chain": "FLR",
  "icon": "coston",
  "rpc": [
    "https://coston-api.flare.network/ext/bc/C/rpc"
  ],
  "faucets": [
    "https://faucet.towolabs.com",
    "https://fauceth.komputing.org?chain=16&address=${ADDRESS}"
  ],
  "nativeCurrency": {
    "name": "Coston Flare",
    "symbol": "CFLR",
    "decimals": 18
  },
  "infoURL": "https://flare.xyz",
  "chainId": 16,
  "networkId": 16,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://coston-explorer.flare.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain