/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_12321 = {
  "name": "BLG Testnet",
  "shortName": "blgchain",
  "chain": "BLG",
  "icon": "blg",
  "rpc": [
    "https://rpc.blgchain.com"
  ],
  "faucets": [
    "https://faucet.blgchain.com"
  ],
  "nativeCurrency": {
    "name": "Blg",
    "symbol": "BLG",
    "decimals": 18
  },
  "infoURL": "https://blgchain.com",
  "chainId": 12321,
  "networkId": 12321,
  "slip44": 1
} satisfies Chain