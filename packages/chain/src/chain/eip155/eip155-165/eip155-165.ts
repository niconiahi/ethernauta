/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_165 = {
  "name": "Omni Testnet",
  "shortName": "omni_testnet",
  "chain": "Omni",
  "rpc": [
    "https://testnet.omni.network"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Omni",
    "symbol": "OMNI",
    "decimals": 18
  },
  "infoURL": "https://docs.omni.network/",
  "chainId": 165,
  "networkId": 165,
  "slip44": 1,
  "explorers": [
    {
      "name": "Omni Explorer",
      "url": "https://testnet.explorer.omni.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain