/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_197710212031 = {
  "name": "Haradev Testnet",
  "shortName": "ntt-haradev",
  "chain": "Ntity",
  "icon": "ntity",
  "rpc": [
    "https://blockchain.haradev.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ntity Haradev",
    "symbol": "NTTH",
    "decimals": 18
  },
  "infoURL": "https://ntity.io",
  "chainId": 197710212031,
  "networkId": 197710212031,
  "slip44": 1,
  "explorers": [
    {
      "name": "Ntity Haradev Blockscout",
      "url": "https://blockscout.haradev.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain