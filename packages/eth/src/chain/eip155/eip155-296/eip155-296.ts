/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_296 = {
  "name": "Hedera Testnet",
  "shortName": "hedera-testnet",
  "chain": "Hedera",
  "icon": "hedera",
  "rpc": [
    "https://testnet.hashio.io/api"
  ],
  "faucets": [
    "https://portal.hedera.com"
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
    "name": "hbar",
    "symbol": "HBAR",
    "decimals": 18
  },
  "infoURL": "https://hedera.com",
  "chainId": 296,
  "networkId": 296,
  "slip44": 1,
  "explorers": [
    {
      "name": "HashScan",
      "url": "https://hashscan.io/testnet",
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