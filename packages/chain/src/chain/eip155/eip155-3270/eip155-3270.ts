/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3270 = {
  "name": "Dubxcoin testnet",
  "shortName": "testdubx",
  "chain": "TESTDUBX",
  "rpc": [
    "https://rpctestnet.arabianchain.org"
  ],
  "faucets": [
    "https://faucet.arabianchain.org/"
  ],
  "nativeCurrency": {
    "name": "Dubxcoin testnet",
    "symbol": "TDUBX",
    "decimals": 18
  },
  "infoURL": "https://arabianchain.org",
  "chainId": 3270,
  "networkId": 3270,
  "slip44": 1
} satisfies Chain