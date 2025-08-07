/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_45513 = {
  "name": "Blessnet",
  "shortName": "bless",
  "chain": "ETH",
  "icon": "bless",
  "rpc": [
    "https://blessnet.calderachain.xyz/http",
    "wss://blessnet.calderachain.xyz/ws"
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
    "name": "Bless",
    "symbol": "BLESS",
    "decimals": 18
  },
  "infoURL": "https://blessnet.io",
  "chainId": 45513,
  "networkId": 45513,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blessnet.calderaexplorer.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-42161",
    "bridges": [
      {
        "url": "https://blessnet.bridge.caldera.xyz"
      }
    ]
  }
} satisfies Chain