/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_65010001 = {
  "name": "Autonity Bakerloo (Barada) Testnet",
  "shortName": "bakerloo-01",
  "chain": "AUT",
  "icon": "autonity",
  "rpc": [
    "https://rpc1.bakerloo.autonity.org/",
    "wss://rpc1.bakerloo.autonity.org/ws/"
  ],
  "faucets": [
    "https://faucet.autonity.org/"
  ],
  "nativeCurrency": {
    "name": "Bakerloo Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "infoURL": "https://autonity.org/",
  "chainId": 65010001,
  "networkId": 65010001,
  "slip44": 1,
  "explorers": [
    {
      "name": "autonity-blockscout",
      "url": "https://bakerloo.autonity.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain