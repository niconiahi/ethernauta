/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8086 = {
  "name": "BitEth",
  "shortName": "BitEth",
  "chain": "BTE",
  "rpc": [
    "https://rpc.biteth.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BitEth",
    "symbol": "BTE",
    "decimals": 18
  },
  "infoURL": "https://biteth.org",
  "chainId": 8086,
  "networkId": 8086,
  "explorers": []
} satisfies Chain