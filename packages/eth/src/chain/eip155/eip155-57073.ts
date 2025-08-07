/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_57073 = {
  "name": "Ink",
  "shortName": "ink",
  "chain": "ETH",
  "rpc": [
    "https://rpc-gel.inkonchain.com",
    "https://rpc-qnd.inkonchain.com",
    "wss://rpc-gel.inkonchain.com",
    "wss://rpc-qnd.inkonchain.com"
  ],
  "faucets": [
    "https://inkonchain.com/faucet"
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
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://inkonchain.com",
  "chainId": 57073,
  "networkId": 57073,
  "explorers": [
    {
      "name": "Ink Explorer",
      "url": "https://explorer.inkonchain.com",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain