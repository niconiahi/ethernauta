/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_100501 = {
  "name": "DeInfra Mainnet",
  "shortName": "deinfra-mainnet",
  "chain": "DeInfraMainnet",
  "icon": "deinfra",
  "rpc": [
    "https://c100501n3.deinfra.net:443/jsonrpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SK",
    "symbol": "SK",
    "decimals": 18
  },
  "infoURL": "https://deinfra.net",
  "chainId": 100501,
  "networkId": 100501,
  "explorers": [
    {
      "name": "Deinfra Mainnet Network Explorer",
      "url": "https://explorer.deinfra.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain