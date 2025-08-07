/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1702448187 = {
  "name": "WITNESS CHAIN",
  "shortName": "Witness",
  "title": "WITNESS CHAIN",
  "chain": "Witness-Chain",
  "icon": "witness",
  "rpc": [
    "https://sequencer.witnesschain.com"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "ETHER",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.witnesschain.com",
  "chainId": 1702448187,
  "networkId": 1702448187,
  "explorers": [
    {
      "name": "Witness Chain Explorer",
      "url": "https://explorer.witnesschain.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.witnesschain.com"
      }
    ]
  },
  "status": "active"
} satisfies Chain