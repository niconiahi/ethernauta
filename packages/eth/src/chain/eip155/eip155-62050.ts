/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_62050 = {
  "name": "Optopia Mainnet",
  "shortName": "Optopia",
  "chain": "ETH",
  "icon": "optopia",
  "rpc": [
    "https://rpc-mainnet.optopia.ai",
    "https://rpc-mainnet-2.optopia.ai"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://optopia.ai",
  "chainId": 62050,
  "networkId": 62050,
  "explorers": [
    {
      "name": "optopia-scan",
      "url": "https://scan.optopia.ai",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.optopia.ai"
      }
    ]
  }
} satisfies Chain