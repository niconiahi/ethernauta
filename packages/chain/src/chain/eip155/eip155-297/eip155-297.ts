/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_297 = {
  "name": "Hedera Previewnet",
  "shortName": "hedera-previewnet",
  "chain": "Hedera",
  "icon": "hedera",
  "rpc": [
    "https://previewnet.hashio.io/api"
  ],
  "faucets": [
    "https://portal.hedera.com"
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
    "name": "hbar",
    "symbol": "HBAR",
    "decimals": 18
  },
  "infoURL": "https://hedera.com",
  "chainId": 297,
  "networkId": 297,
  "slip44": 3030,
  "explorers": [
    {
      "name": "HashScan",
      "url": "https://hashscan.io/previewnet",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain