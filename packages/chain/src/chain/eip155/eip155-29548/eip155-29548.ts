/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_29548 = {
  "name": "MCH Verse Mainnet",
  "shortName": "MCHV",
  "chain": "MCH Verse",
  "icon": "mch_verse",
  "rpc": [
    "https://rpc.oasys.mycryptoheroes.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://www.mycryptoheroes.net/verse",
  "chainId": 29548,
  "networkId": 29548,
  "explorers": [
    {
      "name": "MCH Verse Explorer",
      "url": "https://explorer.oasys.mycryptoheroes.net",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  }
} satisfies Chain