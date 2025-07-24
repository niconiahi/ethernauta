/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_7668378 = {
  "name": "QL1 Testnet",
  "shortName": "tqom",
  "chain": "QOM",
  "icon": "qom",
  "rpc": [
    "https://rpc.testnet.qom.one"
  ],
  "faucets": [
    "https://faucet.qom.one"
  ],
  "nativeCurrency": {
    "name": "Shiba Predator",
    "symbol": "QOM",
    "decimals": 18
  },
  "infoURL": "https://qom.one",
  "chainId": 7668378,
  "networkId": 7668378,
  "slip44": 1,
  "explorers": [
    {
      "name": "QL1 Testnet Explorer",
      "url": "https://testnet.qom.one",
      "standard": "EIP3091"
    }
  ],
  "status": "incubating"
} satisfies Chain