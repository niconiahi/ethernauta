/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1456 = {
  "name": "ZKBase Mainnet",
  "shortName": "zkbase",
  "chain": "ETH",
  "icon": "zkbase",
  "rpc": [
    "https://mainnet-rpc.zkbase.app"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://zkbase.org/",
  "chainId": 1456,
  "networkId": 1456,
  "slip44": 1,
  "explorers": [
    {
      "name": "ZKbase Block Explorer",
      "url": "https://explorer.zkbase.app",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://portal.zkbase.app/"
      }
    ]
  },
  "redFlags": [
    "reusedChainId"
  ]
} satisfies Chain