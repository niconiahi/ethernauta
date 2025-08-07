/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_5101 = {
  "name": "Syndicate Frame Chain",
  "shortName": "syndicate-chain-frame",
  "title": "Syndicate Frame Chain",
  "chain": "Syndicate Frame",
  "icon": "syndicate",
  "rpc": [
    "https://rpc-frame.syndicate.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://syndicate.io",
  "chainId": 5101,
  "networkId": 5101,
  "status": "incubating"
} satisfies Chain