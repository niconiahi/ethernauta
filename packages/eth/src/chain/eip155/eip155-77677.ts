/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_77677 = {
  "name": "Cycle Network Mainnet Sailboat",
  "shortName": "cycles",
  "chain": "ETH",
  "icon": "cycle",
  "rpc": [
    "https://sailboat-rpc-mainnet.cyclenetwork.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.cyclenetwork.io/",
  "chainId": 77677,
  "networkId": 77677
} satisfies Chain