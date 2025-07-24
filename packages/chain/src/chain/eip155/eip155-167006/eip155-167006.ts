/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_167006 = {
  "name": "Taiko Eldfell L3",
  "shortName": "taiko-l3",
  "chain": "ETH",
  "icon": "taiko",
  "rpc": [
    "https://rpc.l3test.taiko.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://taiko.xyz",
  "chainId": 167006,
  "networkId": 167006,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.l3test.taiko.xyz",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain