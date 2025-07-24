/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2022 = {
  "name": "Beresheet BereEVM Testnet",
  "shortName": "edgt",
  "chain": "EDG",
  "rpc": [
    "https://beresheet-evm.jelliedowl.net",
    "wss://beresheet.jelliedowl.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Testnet EDG",
    "symbol": "tEDG",
    "decimals": 18
  },
  "infoURL": "https://edgeware.io/build",
  "chainId": 2022,
  "networkId": 2022,
  "slip44": 1,
  "explorers": [
    {
      "name": "Edgscan by Bharathcoorg",
      "url": "https://testnet.edgscan.live",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain