/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1225 = {
  "name": "Hybrid Testnet",
  "shortName": "hyb",
  "chain": "HYB",
  "icon": "hybridIcon",
  "rpc": [
    "https://hybrid-testnet.rpc.caldera.xyz/http",
    "wss://hybrid-testnet.rpc.caldera.xyz/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Hybrid",
    "symbol": "HYB",
    "decimals": 18
  },
  "infoURL": "https://buildonhybrid.com",
  "chainId": 1225,
  "networkId": 1225,
  "explorers": [
    {
      "name": "Hybrid Testnet",
      "url": "https://explorer.buildonhybrid.com",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain