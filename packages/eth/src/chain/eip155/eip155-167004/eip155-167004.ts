/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_167004 = {
  "name": "Taiko (Alpha-2 Testnet)",
  "shortName": "taiko-a2",
  "chain": "ETH",
  "icon": "taiko",
  "rpc": [
    "https://rpc.a2.taiko.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://taiko.xyz",
  "chainId": 167004,
  "networkId": 167004,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.a2.taiko.xyz",
      "standard": "EIP3091"
    }
  ],
  "status": "deprecated"
} satisfies Chain