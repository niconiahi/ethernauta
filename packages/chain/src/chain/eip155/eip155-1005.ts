/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1005 = {
  "name": "LemonChainTestnet",
  "shortName": "tlemx",
  "chain": "tLEMX",
  "rpc": [
    "https://rpc.testnet.lemonchain.io",
    "https://rpc.testnet.allthingslemon.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "testnet LEMX",
    "symbol": "tLEMX",
    "decimals": 18
  },
  "infoURL": "https://dapp.allthingslemon.io/home",
  "chainId": 1005,
  "networkId": 1005,
  "explorers": []
} satisfies Chain