/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_31612 = {
  "name": "Mezo",
  "shortName": "mezo",
  "chain": "Mezo",
  "icon": "mezo",
  "rpc": [
    "https://rpc_evm-mezo.imperator.co",
    "wss://ws_evm-mezo.imperator.co",
    "https://jsonrpc-mezo.boar.network",
    "wss://jsonrpcws-mezo.boar.network",
    "https://mainnet.mezo.public.validationcloud.io",
    "wss://mainnet.mezo.public.validationcloud.io",
    "https://rpc-internal.mezo.org",
    "wss://rpc-ws-internal.mezo.org"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://mezo.org/",
  "chainId": 31612,
  "networkId": 31612,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.mezo.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain