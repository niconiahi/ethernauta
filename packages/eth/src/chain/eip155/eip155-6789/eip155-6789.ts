/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_6789 = {
  "name": "Gold Smart Chain Mainnet",
  "shortName": "STANDm",
  "chain": "STAND",
  "icon": "stand",
  "rpc": [
    "https://rpc-mainnet.goldsmartchain.com"
  ],
  "faucets": [
    "https://faucet.goldsmartchain.com"
  ],
  "nativeCurrency": {
    "name": "Standard in Gold",
    "symbol": "STAND",
    "decimals": 18
  },
  "infoURL": "https://goldsmartchain.com",
  "chainId": 6789,
  "networkId": 6789,
  "explorers": [
    {
      "name": "Gold Smart Chain",
      "url": "https://mainnet.goldsmartchain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain