/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2625 = {
  "name": "WhiteBIT Network Testnet",
  "shortName": "twbt",
  "chain": "WBT",
  "icon": "whitebit-testnet",
  "rpc": [
    "https://rpc-testnet.whitebit.network"
  ],
  "faucets": [
    "https://explorer.whitebit.network/testnet/faucet"
  ],
  "nativeCurrency": {
    "name": "WhiteBIT Coin",
    "symbol": "WBT",
    "decimals": 18
  },
  "infoURL": "https://whitebit.com/wbt",
  "chainId": 2625,
  "networkId": 2625,
  "slip44": 1,
  "explorers": [
    {
      "name": "wb-explorer-testnet",
      "url": "https://explorer.whitebit.network/testnet",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain