/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_11891 = {
  "name": "Polygon Supernet Arianee",
  "shortName": "Arianee",
  "chain": "Arianee",
  "rpc": [
    "https://rpc.polygonsupernet.public.arianee.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Arianee",
    "symbol": "ARIA20",
    "decimals": 18
  },
  "infoURL": "https://arianee.org",
  "chainId": 11891,
  "networkId": 11891,
  "explorers": [
    {
      "name": "Polygon Supernet Arianee Explorer",
      "url": "https://polygonsupernet.explorer.arianee.net",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  }
} satisfies Chain