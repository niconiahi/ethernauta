/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2458 = {
  "name": "Hybrid Chain Network Testnet",
  "shortName": "thrc",
  "chain": "HYBRID",
  "icon": "hybrid",
  "rpc": [
    "https://rpc-testnet.hybridchain.ai/"
  ],
  "faucets": [
    "https://faucet-testnet.hybridchain.ai"
  ],
  "nativeCurrency": {
    "name": "Hybrid Chain Native Token",
    "symbol": "tHRC",
    "decimals": 18
  },
  "infoURL": "https://hybridchain.ai",
  "chainId": 2458,
  "networkId": 2458,
  "slip44": 1,
  "explorers": [
    {
      "name": "Hybrid Chain Explorer Testnet",
      "url": "https://testnet.hybridscan.ai",
      "standard": "none"
    }
  ]
} satisfies Chain