/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_10218 = {
  "name": "Tea Sepolia Testnet",
  "shortName": "teasep",
  "chain": "ETH",
  "rpc": [
    "https://tea-sepolia.g.alchemy.com/public"
  ],
  "faucets": [
    "https://faucet-sepolia.tea.xyz"
  ],
  "nativeCurrency": {
    "name": "Sepolia Tea",
    "symbol": "TEA",
    "decimals": 18
  },
  "infoURL": "https://tea.xyz",
  "chainId": 10218,
  "networkId": 10218,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://sepolia.tea.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111"
  },
  "status": "active"
} satisfies Chain