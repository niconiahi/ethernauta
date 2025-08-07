/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_12227331 = {
  "name": "NeoX Testnet T3",
  "shortName": "neox",
  "chain": "NeoX",
  "icon": "neox",
  "rpc": [
    "https://neoxseed1.ngd.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Gas",
    "symbol": "GAS",
    "decimals": 18
  },
  "infoURL": "https://neo.org/",
  "chainId": 12227331,
  "networkId": 12227331,
  "explorers": [
    {
      "name": "neox-scan",
      "url": "https://testnet.scan.banelabs.org",
      "standard": "EIP3091"
    }
  ],
  "status": "deprecated"
} satisfies Chain