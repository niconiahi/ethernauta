/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1398244 = {
  "name": "Automata Orbit Testnet",
  "shortName": "automataorbittestnet",
  "chain": "Automata Orbit Testnet",
  "icon": "automata",
  "rpc": [
    "https://rpc-orbit-testnet.ata.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ATA",
    "symbol": "ATA",
    "decimals": 18
  },
  "infoURL": "https://ata.network",
  "chainId": 1398244,
  "networkId": 1398244,
  "explorers": [
    {
      "name": "Automata Orbit Testnet Explorer",
      "url": "https://automata-orbit-testnet-explorer.alt.technology",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain