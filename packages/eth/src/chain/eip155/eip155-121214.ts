/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_121214 = {
  "name": "Rome Testnet Martius",
  "shortName": "rome-testnet-martius",
  "chain": "ROME",
  "icon": "rome",
  "rpc": [
    "https://martius-i.testnet.romeprotocol.xyz"
  ],
  "faucets": [
    "https://deposit.testnet.romeprotocol.xyz"
  ],
  "nativeCurrency": {
    "name": "RSOL",
    "symbol": "RSOL",
    "decimals": 18
  },
  "infoURL": "https://rome.builders",
  "chainId": 121214,
  "networkId": 121214,
  "explorers": [
    {
      "name": "Rome Testnet Martius Explorer",
      "url": "https://romescout-martius-i.testnet.romeprotocol.xyz",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain