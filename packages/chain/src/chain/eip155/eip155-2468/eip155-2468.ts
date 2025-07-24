/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2468 = {
  "name": "Hybrid Chain Network Mainnet",
  "shortName": "hrc",
  "chain": "HYBRID",
  "icon": "hybrid",
  "rpc": [
    "https://coredata-mainnet.hybridchain.ai/",
    "https://rpc-mainnet.hybridchain.ai"
  ],
  "faucets": [
    "https://faucet-testnet.hybridchain.ai"
  ],
  "nativeCurrency": {
    "name": "Hybrid Chain Native Token",
    "symbol": "HRC",
    "decimals": 18
  },
  "infoURL": "https://hybridchain.ai",
  "chainId": 2468,
  "networkId": 2468,
  "explorers": [
    {
      "name": "Hybrid Chain Explorer Mainnet",
      "url": "https://hybridscan.ai",
      "standard": "none"
    }
  ]
} satisfies Chain