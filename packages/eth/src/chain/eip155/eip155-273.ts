/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_273 = {
  "name": "XR One",
  "shortName": "xr1",
  "chain": "ETH",
  "icon": "xr",
  "rpc": [
    "https://xr1.calderachain.xyz/http",
    "wss://xr1.calderachain.xyz/ws"
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
    "name": "XR1",
    "symbol": "XR1",
    "decimals": 18
  },
  "infoURL": "https://xr-one.gitbook.io",
  "chainId": 273,
  "networkId": 273,
  "slip44": 60,
  "explorers": [
    {
      "name": "XR One Explorer",
      "url": "https://xr1.calderaexplorer.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-42161",
    "bridges": [
      {
        "url": "https://xr1.bridge.caldera.xyz"
      }
    ]
  },
  "status": "active"
} satisfies Chain