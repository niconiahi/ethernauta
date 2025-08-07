/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_619 = {
  "name": "Skynet",
  "shortName": "Skynet",
  "chain": "Skynet",
  "rpc": [
    "http://rpc.skynet.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SkyUSD",
    "symbol": "sUSD",
    "decimals": 18
  },
  "infoURL": "http://explorer.skynet.io",
  "chainId": 619,
  "networkId": 619,
  "explorers": [
    {
      "name": "tracehawk",
      "url": "http://explorer.skynet.io",
      "standard": "none"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-42161",
    "bridges": [
      {
        "url": "http://bridge.skynet.io"
      }
    ]
  }
} satisfies Chain