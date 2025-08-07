/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_97435 = {
  "name": "SlingShot Testnet",
  "shortName": "sling",
  "chain": "SLING",
  "icon": "slingshot",
  "rpc": [
    "https://rpc-dependent-emerald-whippet-gh6kch3nen.t.conduit.xyz"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Sling Test",
    "symbol": "SLINGT",
    "decimals": 18
  },
  "infoURL": "https://slingshotdao.com",
  "chainId": 97435,
  "networkId": 97435,
  "explorers": [
    {
      "name": "SlingShot Test Explorer",
      "url": "https://explorer-dependent-emerald-whippet-gh6kch3nen.t.conduit.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain