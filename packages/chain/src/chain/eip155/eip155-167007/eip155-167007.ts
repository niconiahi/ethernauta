/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_167007 = {
  "name": "Taiko Jolnir L2",
  "shortName": "tko-jolnir",
  "chain": "ETH",
  "icon": "taiko",
  "rpc": [
    "https://rpc.jolnir.taiko.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://taiko.xyz",
  "chainId": 167007,
  "networkId": 167007,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.jolnir.taiko.xyz",
      "standard": "EIP3091"
    }
  ],
  "status": "incubating"
} satisfies Chain