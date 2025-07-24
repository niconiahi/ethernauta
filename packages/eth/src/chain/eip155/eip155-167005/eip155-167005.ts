/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_167005 = {
  "name": "Taiko Grimsvotn L2",
  "shortName": "taiko-l2",
  "chain": "ETH",
  "icon": "taiko",
  "rpc": [
    "https://rpc.test.taiko.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://taiko.xyz",
  "chainId": 167005,
  "networkId": 167005,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.test.taiko.xyz",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain