/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1337803 = {
  "name": "Zhejiang",
  "shortName": "zhejiang",
  "chain": "ETH",
  "icon": "ethereum",
  "rpc": [
    "https://rpc.zhejiang.ethpandaops.io"
  ],
  "faucets": [
    "https://faucet.zhejiang.ethpandaops.io",
    "https://zhejiang-faucet.pk910.de"
  ],
  "nativeCurrency": {
    "name": "Testnet ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://zhejiang.ethpandaops.io",
  "chainId": 1337803,
  "networkId": 1337803,
  "explorers": [
    {
      "name": "Zhejiang Explorer",
      "url": "https://zhejiang.beaconcha.in",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain