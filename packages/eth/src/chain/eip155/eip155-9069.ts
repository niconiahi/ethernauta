/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9069 = {
  "name": "Apex Fusion - Nexus Mainnet",
  "shortName": "AP3X",
  "chain": "Nexus Mainnet",
  "icon": "apexfusion",
  "rpc": [
    "https://rpc.nexus.mainnet.apexfusion.org/"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Apex Fusion Token",
    "symbol": "AP3X",
    "decimals": 18
  },
  "infoURL": "https://apexfusion.org/",
  "chainId": 9069,
  "networkId": 9069,
  "explorers": []
} satisfies Chain