/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1139 = {
  "name": "MathChain",
  "shortName": "MATH",
  "chain": "MATH",
  "rpc": [
    "https://mathchain-asia.maiziqianbao.net/rpc",
    "https://mathchain-us.maiziqianbao.net/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MathChain",
    "symbol": "MATH",
    "decimals": 18
  },
  "infoURL": "https://mathchain.org",
  "chainId": 1139,
  "networkId": 1139
} satisfies Chain