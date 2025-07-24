/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5001 = {
  "name": "Mantle Testnet",
  "shortName": "mantle-testnet",
  "chain": "ETH",
  "rpc": [
    "https://rpc.testnet.mantle.xyz"
  ],
  "faucets": [
    "https://faucet.testnet.mantle.xyz"
  ],
  "nativeCurrency": {
    "name": "Testnet Mantle",
    "symbol": "MNT",
    "decimals": 18
  },
  "infoURL": "https://mantle.xyz",
  "chainId": 5001,
  "networkId": 5001,
  "slip44": 1,
  "explorers": [
    {
      "name": "Mantle Testnet Explorer",
      "url": "https://explorer.testnet.mantle.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain