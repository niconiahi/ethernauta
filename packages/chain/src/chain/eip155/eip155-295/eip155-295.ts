/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_295 = {
  "name": "Hedera Mainnet",
  "shortName": "hedera-mainnet",
  "chain": "Hedera",
  "icon": "hedera",
  "rpc": [
    "https://mainnet.hashio.io/api"
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
    "name": "hbar",
    "symbol": "HBAR",
    "decimals": 18
  },
  "infoURL": "https://hedera.com",
  "chainId": 295,
  "networkId": 295,
  "slip44": 3030,
  "explorers": [
    {
      "name": "HashScan",
      "url": "https://hashscan.io/mainnet",
      "standard": "EIP3091"
    },
    {
      "name": "Arkhia Explorer",
      "url": "https://explorer.arkhia.io",
      "standard": "none"
    },
    {
      "name": "DragonGlass",
      "url": "https://app.dragonglass.me",
      "standard": "none"
    },
    {
      "name": "Hedera Explorer",
      "url": "https://hederaexplorer.io",
      "standard": "none"
    },
    {
      "name": "Ledger Works Explore",
      "url": "https://explore.lworks.io",
      "standard": "none"
    }
  ]
} satisfies Chain