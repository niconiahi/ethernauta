/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_558 = {
  "name": "Tao Network",
  "shortName": "tao",
  "chain": "TAO",
  "rpc": [
    "https://rpc.testnet.tao.network",
    "http://rpc.testnet.tao.network:8545",
    "https://rpc.tao.network",
    "wss://rpc.tao.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tao",
    "symbol": "TAO",
    "decimals": 18
  },
  "infoURL": "https://tao.network",
  "chainId": 558,
  "networkId": 558
} satisfies Chain