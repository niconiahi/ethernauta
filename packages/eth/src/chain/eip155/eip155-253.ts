/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_253 = {
  "name": "Glide L2 Protocol XP",
  "shortName": "glidexp",
  "chain": "GLXP",
  "icon": "glide",
  "rpc": [
    "https://rpc-api.glideprotocol.xyz/l2-rpc/",
    "wss://rpc-api.glideprotocol.xyz/l2-rpc/"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Glide XP",
    "symbol": "GLXP",
    "decimals": 18
  },
  "infoURL": "https://glideprotocol.xyz",
  "chainId": 253,
  "networkId": 253,
  "explorers": [
    {
      "name": "glidescan",
      "url": "https://blockchain-explorer.glideprotocol.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-251"
  },
  "status": "active"
} satisfies Chain