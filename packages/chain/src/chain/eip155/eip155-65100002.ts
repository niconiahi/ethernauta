/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_65100002 = {
  "name": "Autonity Piccadilly (Sumida) Testnet",
  "shortName": "piccadilly-02",
  "chain": "AUT",
  "icon": "autonity",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Piccadilly Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "infoURL": "https://autonity.org/",
  "chainId": 65100002,
  "networkId": 65100002,
  "slip44": 1,
  "explorers": [
    {
      "name": "autonity-blockscout",
      "url": "https://piccadilly.autonity.org",
      "standard": "EIP3091"
    }
  ],
  "status": "deprecated"
} satisfies Chain