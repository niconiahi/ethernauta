/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_73927 = {
  "name": "Mixin Virtual Machine",
  "shortName": "mvm",
  "chain": "MVM",
  "icon": "mvm",
  "rpc": [
    "https://geth.mvm.dev"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://mvm.dev",
  "chainId": 73927,
  "networkId": 73927,
  "explorers": [
    {
      "name": "mvmscan",
      "url": "https://scan.mvm.dev",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain