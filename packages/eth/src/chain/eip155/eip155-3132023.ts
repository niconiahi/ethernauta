/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_3132023 = {
  "name": "Sahara AI",
  "shortName": "sahara",
  "chain": "Sahara",
  "icon": "sahara",
  "rpc": [
    "https://mainnet.saharalabs.ai"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Sahara AI",
    "symbol": "SAHARA",
    "decimals": 18
  },
  "infoURL": "https://saharalabs.ai",
  "chainId": 3132023,
  "networkId": 3132023,
  "explorers": []
} satisfies Chain