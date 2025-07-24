/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1146703430 = {
  "name": "CyberdeckNet",
  "shortName": "cyb",
  "chain": "cyberdeck",
  "icon": "cyberdeck",
  "rpc": [
    "http://cybeth1.cyberdeck.eu:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Cyb",
    "symbol": "CYB",
    "decimals": 18
  },
  "infoURL": "https://cyberdeck.eu",
  "chainId": 1146703430,
  "networkId": 1146703430,
  "explorers": [
    {
      "name": "CybEthExplorer",
      "url": "http://cybeth1.cyberdeck.eu:8000",
      "standard": "none"
    }
  ],
  "status": "active"
} satisfies Chain