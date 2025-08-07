/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_12227332 = {
  "name": "Neo X Testnet T4",
  "shortName": "neox-t4",
  "chain": "Neo X",
  "icon": "neox",
  "rpc": [
    "https://testnet.rpc.banelabs.org/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Gas",
    "symbol": "GAS",
    "decimals": 18
  },
  "infoURL": "https://neo.org/",
  "chainId": 12227332,
  "networkId": 12227332,
  "explorers": [
    {
      "name": "neox-scan",
      "url": "https://xt4scan.ngd.network",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain