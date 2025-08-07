/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_42000 = {
  "name": "Helios Chain Testnet",
  "shortName": "HLS",
  "chain": "Helios Chain",
  "icon": "helioschain",
  "rpc": [
    "https://testnet1.helioschainlabs.org"
  ],
  "faucets": [
    "https://testnet.helioschain.network"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Helios",
    "symbol": "HLS",
    "decimals": 18
  },
  "infoURL": "https://hub.helioschain.network",
  "chainId": 42000,
  "networkId": 42000,
  "explorers": [
    {
      "name": "Helios Chain Explorer",
      "url": "https://explorer.helioschainlabs.org",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain