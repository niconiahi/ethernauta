/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_9790 = {
  "name": "Carbon EVM",
  "shortName": "carbon",
  "chain": "Carbon",
  "icon": "carbon",
  "rpc": [
    "https://evm-api.carbon.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "swth",
    "symbol": "SWTH",
    "decimals": 18
  },
  "infoURL": "https://carbon.network/",
  "chainId": 9790,
  "networkId": 9790,
  "explorers": []
} satisfies Chain