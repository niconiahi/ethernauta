/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3434 = {
  "name": "SecureChain Testnet",
  "shortName": "SCAIt",
  "chain": "SCAI",
  "icon": "scaiIcon",
  "rpc": [
    "https://testnet-rpc.securechain.ai"
  ],
  "faucets": [
    "https://faucet.securechain.ai"
  ],
  "nativeCurrency": {
    "name": "SCAI",
    "symbol": "SCAI",
    "decimals": 18
  },
  "infoURL": "https://securechain.ai",
  "chainId": 3434,
  "networkId": 3434,
  "slip44": 1,
  "explorers": [
    {
      "name": "SecureChain",
      "url": "https://testnet.securechain.ai",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain