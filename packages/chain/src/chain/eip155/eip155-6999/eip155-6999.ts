/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_6999 = {
  "name": "PolySmartChain",
  "shortName": "psc",
  "chain": "PSC",
  "rpc": [
    "https://seed0.polysmartchain.com/",
    "https://seed1.polysmartchain.com/",
    "https://seed2.polysmartchain.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PSC",
    "symbol": "PSC",
    "decimals": 18
  },
  "infoURL": "https://www.polysmartchain.com/",
  "chainId": 6999,
  "networkId": 6999
} satisfies Chain