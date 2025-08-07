/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1625 = {
  "name": "Gravity Alpha Mainnet",
  "shortName": "gravity",
  "chain": "Gravity",
  "icon": "gravity",
  "rpc": [
    "https://rpc.gravity.xyz",
    "https://rpc.ankr.com/gravity"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    },
    {
      "name": "EIP1108"
    }
  ],
  "nativeCurrency": {
    "name": "Gravity",
    "symbol": "G",
    "decimals": 18
  },
  "infoURL": "https://gravity.xyz",
  "chainId": 1625,
  "networkId": 1625,
  "explorers": [
    {
      "name": "Gravity Alpha Mainnet Explorer",
      "url": "https://explorer.gravity.xyz",
      "standard": "EIP3091"
    },
    {
      "name": "gscan",
      "url": "https://gscan.xyz",
      "standard": "EIP3091"
    },
    {
      "name": "OKLink",
      "url": "https://www.oklink.com/gravity-alpha",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.gravity.xyz"
      }
    ]
  }
} satisfies Chain