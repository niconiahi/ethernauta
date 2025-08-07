/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_20221001 = {
  "name": "SoonChain Sepolia Devnet",
  "shortName": "Soon-Devnet",
  "chain": "SoonChain Devnet Sepolia",
  "icon": "soonchain",
  "rpc": [
    "https://sepolia.rpc.soonchain.ai"
  ],
  "faucets": [
    "https://console.optimism.io/faucet"
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
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://soonchain.ai",
  "chainId": 20221001,
  "networkId": 20221001,
  "explorers": [
    {
      "name": "Soon Scan",
      "url": "https://sepolia.explorer.soonchain.ai",
      "standard": "none"
    }
  ]
} satisfies Chain