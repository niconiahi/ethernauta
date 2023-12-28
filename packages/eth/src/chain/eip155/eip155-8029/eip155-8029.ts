/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8029 = {
  "name": "MDGL Testnet",
  "shortName": "mdgl",
  "chain": "MDGL",
  "rpc": [
    "https://testnet.mdgl.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MDGL Token",
    "symbol": "MDGLT",
    "decimals": 18
  },
  "infoURL": "https://mdgl.io",
  "chainId": 8029,
  "networkId": 8029,
  "slip44": 1
} satisfies Chain