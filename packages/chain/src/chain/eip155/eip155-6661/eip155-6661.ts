/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_6661 = {
  "name": "Cybria Mainnet",
  "shortName": "cyba",
  "chain": "CYBA",
  "icon": "cybria",
  "rpc": [
    "https://rpc-mainnet.cybria.io"
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
    "name": "Cybria",
    "symbol": "CYBA",
    "decimals": 18
  },
  "infoURL": "https://cybria.io",
  "chainId": 6661,
  "networkId": 6661,
  "explorers": [
    {
      "name": "Cybria Explorer",
      "url": "https://cybascan.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155420",
    "bridges": [
      {
        "url": "https://app.optimism.io/bridge"
      }
    ]
  }
} satisfies Chain