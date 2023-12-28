/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1773 = {
  "name": "PartyChain",
  "shortName": "TeaParty",
  "chain": "mainnet",
  "icon": "grams",
  "rpc": [
    "https://tea.mining4people.com/rpc",
    "http://172.104.194.36:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Grams",
    "symbol": "GRAMS",
    "decimals": 18
  },
  "infoURL": "TeaPartyCrypto.com",
  "chainId": 1773,
  "networkId": 1773,
  "explorers": [
    {
      "name": "PartyExplorer",
      "url": "https://partyexplorer.co",
      "standard": "EIP3091"
    }
  ],
  "status": "incubating"
} satisfies Chain