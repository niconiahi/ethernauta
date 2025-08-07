/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_171000 = {
  "name": "Fair Testnet",
  "shortName": "fairt",
  "chain": "FAIR",
  "rpc": [
    "https://rpc-testnet.xfair.ai",
    "wss://rpc-testnet.xfair.ai"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "FAIR",
    "symbol": "FAIR",
    "decimals": 18
  },
  "infoURL": "https://xfair.ai",
  "chainId": 171000,
  "networkId": 171000
} satisfies Chain