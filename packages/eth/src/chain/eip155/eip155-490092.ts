/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_490092 = {
  "name": "PUMPFI CHAIN TESTNET",
  "shortName": "pumpfi-testnet",
  "chain": "PUMPFI CHAIN TESTNET",
  "rpc": [
    "https://rpc1testnet.pumpfi.me"
  ],
  "faucets": [
    "https://faucet.pumpfi.me"
  ],
  "nativeCurrency": {
    "name": "PMPT",
    "symbol": "PMPT",
    "decimals": 18
  },
  "infoURL": "https://pumpfi.me",
  "chainId": 490092,
  "networkId": 490092,
  "explorers": [
    {
      "name": "Pumpfi Testnet Scan",
      "url": "https://testnetscan.pumpfi.me",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain