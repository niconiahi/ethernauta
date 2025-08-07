/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_96371 = {
  "name": "Wonder Testnet",
  "shortName": "wndr",
  "chain": "WNDR",
  "icon": "wonder",
  "rpc": [
    "https://rpc.testnet.wonderchain.org"
  ],
  "faucets": [
    "https://wonderchain.org/faucet"
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://wonderchain.org",
  "chainId": 96371,
  "networkId": 96371,
  "explorers": [
    {
      "name": "wonderexplorer",
      "url": "https://explorer.testnet.wonderchain.org",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain