/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1954 = {
  "name": "Dexilla Testnet",
  "shortName": "Dexilla",
  "chain": "Dexilla",
  "icon": "dxz",
  "rpc": [
    "https://rpc.dexilla.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dexilla Native Token",
    "symbol": "DXZ",
    "decimals": 18
  },
  "infoURL": "https://dexilla.com",
  "chainId": 1954,
  "networkId": 1954,
  "slip44": 1,
  "explorers": [
    {
      "name": "dos-mainnet",
      "url": "https://exp.dexilla.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://bridge.dexilla.com"
      }
    ]
  }
} satisfies Chain