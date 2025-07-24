/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_648 = {
  "name": "Endurance Smart Chain Mainnet",
  "shortName": "ace",
  "chain": "ACE",
  "rpc": [
    "https://rpc-endurance.fusionist.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Endurance Chain Native Token",
    "symbol": "ACE",
    "decimals": 18
  },
  "infoURL": "https://ace.fusionist.io/",
  "chainId": 648,
  "networkId": 648,
  "explorers": [
    {
      "name": "Endurance Scan",
      "url": "https://explorer.endurance.fusionist.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain