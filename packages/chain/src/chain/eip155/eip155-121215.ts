/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_121215 = {
  "name": "Rome Testnet Caelian",
  "shortName": "rome-testnet-caelian",
  "chain": "ROME",
  "icon": "rome",
  "rpc": [
    "https://caelian-i.testnet.romeprotocol.xyz"
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
  "chainId": 121215,
  "networkId": 121215,
  "explorers": [
    {
      "name": "Rome Testnet Caelian Explorer",
      "url": "https://romescout-caelian-i.testnet.romeprotocol.xyz",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain