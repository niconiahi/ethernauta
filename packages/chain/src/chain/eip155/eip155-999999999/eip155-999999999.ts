/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_999999999 = {
  "name": "Zora Sepolia Testnet",
  "shortName": "zsep",
  "chain": "ETH",
  "icon": "zoraSepoliaTestnet",
  "rpc": [
    "https://sepolia.rpc.zora.energy"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://zora.energy",
  "chainId": 999999999,
  "networkId": 999999999,
  "slip44": 1,
  "explorers": [
    {
      "name": "Zora Sepolia Testnet Network Explorer",
      "url": "https://sepolia.explorer.zora.energy",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain