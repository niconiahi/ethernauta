/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5003 = {
  "name": "Mantle Sepolia Testnet",
  "shortName": "mnt-sep",
  "chain": "ETH",
  "rpc": [
    "https://rpc.sepolia.mantle.xyz"
  ],
  "faucets": [
    "https://faucet.sepolia.mantle.xyz"
  ],
  "nativeCurrency": {
    "name": "Sepolia Mantle",
    "symbol": "MNT",
    "decimals": 18
  },
  "infoURL": "https://mantle.xyz",
  "chainId": 5003,
  "networkId": 5003,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.sepolia.mantle.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain