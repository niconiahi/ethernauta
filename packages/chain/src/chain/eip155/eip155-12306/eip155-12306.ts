/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_12306 = {
  "name": "Fibonacci Mainnet",
  "shortName": "fibo",
  "chain": "FIBO",
  "icon": "fibonacci",
  "rpc": [
    "https://node1.fibo-api.asia",
    "https://node2.fibo-api.asia",
    "https://node3.fibo-api.asia",
    "https://node4.fibo-api.asia",
    "https://node5.fibo-api.asia",
    "https://node6.fibo-api.asia",
    "https://node7.fibo-api.asia",
    "https://node1.fibo-rpc.asia",
    "https://node2.fibo-rpc.asia",
    "https://node3.fibo-rpc.asia",
    "https://node4.fibo-rpc.asia",
    "https://node5.fibo-rpc.asia",
    "https://node6.fibo-rpc.asia",
    "https://node7.fibo-rpc.asia"
  ],
  "faucets": [
    "https://test.fibochain.org/faucets"
  ],
  "nativeCurrency": {
    "name": "FIBONACCI UTILITY TOKEN",
    "symbol": "FIBO",
    "decimals": 18
  },
  "infoURL": "https://fibochain.org",
  "chainId": 12306,
  "networkId": 1230,
  "explorers": [
    {
      "name": "fiboscan",
      "url": "https://scan.fibochain.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain