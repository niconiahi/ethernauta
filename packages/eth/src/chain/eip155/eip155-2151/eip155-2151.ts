/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2151 = {
  "name": "BOSagora Mainnet",
  "shortName": "boa",
  "chain": "ETH",
  "icon": "agora",
  "rpc": [
    "https://mainnet.bosagora.org",
    "https://rpc.bosagora.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BOSAGORA",
    "symbol": "BOA",
    "decimals": 18
  },
  "infoURL": "https://docs.bosagora.org",
  "chainId": 2151,
  "networkId": 2151,
  "explorers": [
    {
      "name": "BOASCAN",
      "url": "https://boascan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain