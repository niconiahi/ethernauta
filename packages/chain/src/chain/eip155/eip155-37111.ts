/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_37111 = {
  "name": "Lens Testnet",
  "shortName": "lens-sepolia",
  "title": "Lens Network Sepolia Testnet",
  "chain": "Lens",
  "icon": "lens",
  "rpc": [
    "https://rpc.testnet.lens.dev"
  ],
  "faucets": [
    "https://www.alchemy.com/faucets/lens-sepolia"
  ],
  "nativeCurrency": {
    "name": "GRASS",
    "symbol": "GRASS",
    "decimals": 18
  },
  "infoURL": "https://www.lens.xyz",
  "chainId": 37111,
  "networkId": 37111,
  "explorers": [
    {
      "name": "Lens Testnet Block Explorer",
      "url": "https://block-explorer.testnet.lens.dev",
      "standard": "none"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://portal.testnet.lens.dev/bridge"
      }
    ]
  }
} satisfies Chain