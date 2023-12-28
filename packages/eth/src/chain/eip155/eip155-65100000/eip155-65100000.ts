/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_65100000 = {
  "name": "Autonity Piccadilly (Thames) Testnet",
  "shortName": "piccadilly-0",
  "chain": "AUT",
  "icon": "autonity",
  "rpc": [],
  "faucets": [
    "https://faucet.autonity.org/"
  ],
  "nativeCurrency": {
    "name": "Piccadilly Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "infoURL": "https://autonity.org/",
  "chainId": 65100000,
  "networkId": 65100000,
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