/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_79879 = {
  "name": "Gold Smart Chain Testnet",
  "shortName": "STANDt",
  "chain": "STAND",
  "icon": "standTestnet",
  "rpc": [
    "https://rpc-testnet.goldsmartchain.com"
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
  "chainId": 79879,
  "networkId": 79879,
  "slip44": 1,
  "explorers": [
    {
      "name": "Gold Smart Chain",
      "url": "https://testnet.goldsmartchain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain