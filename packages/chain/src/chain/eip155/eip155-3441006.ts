/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_3441006 = {
  "name": "Manta Pacific Sepolia Testnet",
  "shortName": "mantaSepoliaTestnet",
  "chain": "Manta Pacific",
  "icon": "manta",
  "rpc": [
    "https://pacific-rpc.sepolia-testnet.manta.network/http"
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
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://manta-testnet.caldera.dev/",
  "chainId": 3441006,
  "networkId": 3441006,
  "slip44": 1,
  "explorers": [
    {
      "name": "manta-testnet Explorer",
      "url": "https://pacific-explorer.sepolia-testnet.manta.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain