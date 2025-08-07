/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_33133 = {
  "name": "Entangle Testnet",
  "shortName": "tngl",
  "chain": "NGL",
  "icon": "ngl",
  "rpc": [
    "https://evm-testnet.entangle.fi"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Entangle",
    "symbol": "NGL",
    "decimals": 18
  },
  "infoURL": "https://www.entangle.fi",
  "chainId": 33133,
  "networkId": 33133,
  "explorers": []
} satisfies Chain