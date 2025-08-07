/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1223 = {
  "name": "Cycle Network Testnet Jellyfish",
  "shortName": "cyclej",
  "chain": "ETH",
  "icon": "cycle",
  "rpc": [
    "https://jellyfish-rpc-testnet.cyclenetwork.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.cyclenetwork.io/",
  "chainId": 1223,
  "networkId": 1223
} satisfies Chain