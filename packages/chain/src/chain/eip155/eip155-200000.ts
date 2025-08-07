/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_200000 = {
  "name": "xFair.AI Testnet",
  "shortName": "fait",
  "chain": "FAIT",
  "rpc": [
    "https://rpc_testnet.xfair.ai",
    "wss://rpc_testnet.xfair.ai"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "FAI",
    "symbol": "FAI",
    "decimals": 18
  },
  "infoURL": "https://xfair.ai",
  "chainId": 200000,
  "networkId": 200000
} satisfies Chain