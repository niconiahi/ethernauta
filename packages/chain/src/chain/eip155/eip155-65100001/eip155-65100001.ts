/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_65100001 = {
  "name": "Autonity Piccadilly (Barada) Testnet",
  "shortName": "piccadilly-01",
  "chain": "AUT",
  "icon": "autonity",
  "rpc": [
    "https://rpc1.piccadilly.autonity.org/",
    "wss://rpc1.piccadilly.autonity.org/ws/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Piccadilly Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "infoURL": "https://autonity.org/",
  "chainId": 65100001,
  "networkId": 65100001,
  "slip44": 1,
  "explorers": [
    {
      "name": "autonity-blockscout",
      "url": "https://piccadilly.autonity.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain