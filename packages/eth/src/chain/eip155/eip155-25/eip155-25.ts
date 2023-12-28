/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_25 = {
  "name": "Cronos Mainnet",
  "shortName": "cro",
  "chain": "CRO",
  "rpc": [
    "https://evm.cronos.org",
    "https://cronos-evm.publicnode.com",
    "wss://cronos-evm.publicnode.com"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Cronos",
    "symbol": "CRO",
    "decimals": 18
  },
  "infoURL": "https://cronos.org/",
  "chainId": 25,
  "networkId": 25,
  "explorers": [
    {
      "name": "Cronos Explorer",
      "url": "https://explorer.cronos.org",
      "standard": "none"
    }
  ]
} satisfies Chain