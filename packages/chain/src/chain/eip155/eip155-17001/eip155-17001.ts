/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_17001 = {
  "name": "Redstone Holesky Testnet",
  "shortName": "redstone",
  "chain": "ETH",
  "icon": "redstone",
  "rpc": [
    "https://rpc.holesky.redstone.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Redstone Testnet Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://redstone.xyz/docs/network-info",
  "chainId": 17001,
  "networkId": 17001,
  "slip44": 1,
  "explorers": [
    {
      "name": "Redstone Holesky Explorer",
      "url": "https://explorer.holesky.redstone.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain