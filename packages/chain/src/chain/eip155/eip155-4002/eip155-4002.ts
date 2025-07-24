/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4002 = {
  "name": "Fantom Testnet",
  "shortName": "tftm",
  "chain": "FTM",
  "icon": "fantom",
  "rpc": [
    "https://rpc.testnet.fantom.network",
    "https://fantom-testnet.publicnode.com",
    "wss://fantom-testnet.publicnode.com"
  ],
  "faucets": [
    "https://faucet.fantom.network"
  ],
  "nativeCurrency": {
    "name": "Fantom",
    "symbol": "FTM",
    "decimals": 18
  },
  "infoURL": "https://docs.fantom.foundation/quick-start/short-guide#fantom-testnet",
  "chainId": 4002,
  "networkId": 4002,
  "slip44": 1,
  "explorers": [
    {
      "name": "ftmscan",
      "url": "https://testnet.ftmscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain