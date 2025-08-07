/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_8386 = {
  "name": "XProtocol",
  "shortName": "xprotocol",
  "chain": "XPROTOCOL",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Kick",
    "symbol": "KICK",
    "decimals": 18
  },
  "infoURL": "https://xprotocol.org/",
  "chainId": 8386,
  "networkId": 8386,
  "parent": {
    "type": "L2",
    "chain": "eip155-8453"
  },
  "status": "incubating"
} satisfies Chain