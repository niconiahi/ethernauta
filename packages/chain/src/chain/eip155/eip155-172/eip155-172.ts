/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_172 = {
  "name": "Latam-Blockchain Resil Testnet",
  "shortName": "resil",
  "chain": "Resil",
  "rpc": [
    "https://rpc.latam-blockchain.com",
    "wss://ws.latam-blockchain.com"
  ],
  "faucets": [
    "https://faucet.latam-blockchain.com"
  ],
  "nativeCurrency": {
    "name": "Latam-Blockchain Resil Test Native Token",
    "symbol": "usd",
    "decimals": 18
  },
  "infoURL": "https://latam-blockchain.com",
  "chainId": 172,
  "networkId": 172,
  "slip44": 1
} satisfies Chain