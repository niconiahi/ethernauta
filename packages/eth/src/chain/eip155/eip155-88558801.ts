/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_88558801 = {
  "name": "Backstop Testnet",
  "shortName": "backstop-testnet",
  "chain": "backstopTestnet",
  "icon": "backstop",
  "rpc": [
    "https://testnet.rpc.backstop.technology"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Backstop Testnet 1",
    "symbol": "ZBS",
    "decimals": 18
  },
  "infoURL": "https://backstop.technology/testnet",
  "chainId": 88558801,
  "networkId": 88558801,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://testnet.bridge.backstop.technology"
      }
    ]
  }
} satisfies Chain