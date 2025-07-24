/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1089 = {
  "name": "Humans.ai Mainnet",
  "shortName": "humans",
  "chain": "Humans",
  "icon": "humans-dark",
  "rpc": [
    "https://jsonrpc.humans.nodestake.top",
    "https://humans-mainnet-evm.itrocket.net:443",
    "https://humans-evm-rpc.staketab.org:443",
    "https://evm.humans.stakepool.dev.br",
    "https://mainnet-humans-evm.konsortech.xyz",
    "https://evm-rpc.mainnet.humans.zone"
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
    "name": "HEART",
    "symbol": "HEART",
    "decimals": 18
  },
  "infoURL": "https://humans.ai",
  "chainId": 1089,
  "networkId": 1089,
  "explorers": [
    {
      "name": "explorer.guru",
      "url": "https://humans.explorers.guru",
      "standard": "none"
    }
  ]
} satisfies Chain