/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_766 = {
  "name": "QL1",
  "shortName": "qom",
  "chain": "QOM",
  "icon": "qom",
  "rpc": [
    "https://rpc.qom.one"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Shiba Predator",
    "symbol": "QOM",
    "decimals": 18
  },
  "infoURL": "https://qom.one",
  "chainId": 766,
  "networkId": 766,
  "explorers": [
    {
      "name": "QL1 Mainnet Explorer",
      "url": "https://mainnet.qom.one",
      "standard": "EIP3091"
    }
  ],
  "status": "incubating"
} satisfies Chain