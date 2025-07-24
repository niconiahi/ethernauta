/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_65010000 = {
  "name": "Autonity Bakerloo (Thames) Testnet",
  "shortName": "bakerloo-0",
  "chain": "AUT",
  "icon": "autonity",
  "rpc": [],
  "faucets": [
    "https://faucet.autonity.org/"
  ],
  "nativeCurrency": {
    "name": "Bakerloo Auton",
    "symbol": "ATN",
    "decimals": 18
  },
  "infoURL": "https://autonity.org/",
  "chainId": 65010000,
  "networkId": 65010000,
  "slip44": 1,
  "explorers": [
    {
      "name": "autonity-blockscout",
      "url": "https://bakerloo.autonity.org",
      "standard": "EIP3091"
    }
  ],
  "status": "deprecated"
} satisfies Chain