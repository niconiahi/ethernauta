/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_64 = {
  "name": "Ellaism",
  "shortName": "ellaism",
  "chain": "ELLA",
  "rpc": [
    "https://jsonrpc.ellaism.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ellaism Ether",
    "symbol": "ELLA",
    "decimals": 18
  },
  "infoURL": "https://ellaism.org",
  "chainId": 64,
  "networkId": 64,
  "slip44": 163
} satisfies Chain