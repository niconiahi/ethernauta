/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_29225 = {
  "name": "Nexa MetaTest",
  "shortName": "nexatest",
  "chain": "NEXA",
  "icon": "nexameta",
  "rpc": [
    "https://nexa.sh/metatest"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Nexa",
    "symbol": "NEXA",
    "decimals": 18
  },
  "infoURL": "https://nexa.sh/meta",
  "chainId": 29225,
  "networkId": 29225,
  "slip44": 29225,
  "explorers": [
    {
      "name": "NexaShell",
      "url": "https://nexa.sh",
      "standard": "none"
    }
  ]
} satisfies Chain