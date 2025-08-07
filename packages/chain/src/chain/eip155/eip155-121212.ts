/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_121212 = {
  "name": "Rome Devnet Esquiline",
  "shortName": "rome-devnet-esquiline",
  "chain": "ROME",
  "icon": "rome",
  "rpc": [
    "https://esquiline-i.devnet.romeprotocol.xyz"
  ],
  "faucets": [
    "https://deposit.devnet.romeprotocol.xyz"
  ],
  "nativeCurrency": {
    "name": "RSOL",
    "symbol": "RSOL",
    "decimals": 18
  },
  "infoURL": "https://rome.builders",
  "chainId": 121212,
  "networkId": 121212,
  "explorers": [
    {
      "name": "Rome Devnet Esquiline Explorer",
      "url": "https://romescout-esquiline-i.devnet.romeprotocol.xyz",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain