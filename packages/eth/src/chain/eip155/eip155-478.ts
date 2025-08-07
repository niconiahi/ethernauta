/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_478 = {
  "name": "Form Network",
  "shortName": "formnetwork",
  "title": "Form Network",
  "chain": "form",
  "icon": "form",
  "rpc": [
    "https://rpc.form.network/http",
    "wss://rpc.form.network/ws"
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
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://info.form.network",
  "chainId": 478,
  "networkId": 478,
  "explorers": [
    {
      "name": "Form Explorer",
      "url": "https://explorer.form.network",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.form.network"
      },
      {
        "url": "https://op-bridge.form.network"
      }
    ]
  },
  "status": "active"
} satisfies Chain