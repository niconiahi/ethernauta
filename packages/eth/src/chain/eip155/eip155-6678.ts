/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_6678 = {
  "name": "Edge Matrix Chain",
  "shortName": "EMC",
  "chain": "EMC",
  "icon": "emc",
  "rpc": [
    "https://rpc1-mainnet.emc.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Edge Matrix Chain Token",
    "symbol": "EMC",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 6678,
  "networkId": 6678,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://emcscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain