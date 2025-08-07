/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_21210 = {
  "name": "1Money Network Mainnet",
  "shortName": "1money",
  "chain": "1Money Network",
  "rpc": [
    "https://mainnet.1money.network"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "USD1",
    "symbol": "USD1",
    "decimals": 18
  },
  "infoURL": "https://1money.com",
  "chainId": 21210,
  "networkId": 21210,
  "explorers": []
} satisfies Chain