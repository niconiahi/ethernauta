/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_13370 = {
  "name": "Cannon Testnet",
  "shortName": "cannon",
  "title": "Cannon Private Testnet",
  "chain": "ETH",
  "rpc": [
    "http://127.0.0.1:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Cannon Testnet Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://usecannon.com",
  "chainId": 13370,
  "networkId": 13370
} satisfies Chain