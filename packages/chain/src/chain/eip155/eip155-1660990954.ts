/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1660990954 = {
  "name": "Status Network Sepolia",
  "shortName": "sn-sepolia",
  "title": "Status Network Sepolia",
  "chain": "ETH",
  "icon": "sn",
  "rpc": [
    "https://public.sepolia.rpc.status.network"
  ],
  "faucets": [
    "https://faucet.status.network/"
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://status.network",
  "chainId": 1660990954,
  "networkId": 1660990954,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://sepoliascan.status.network",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://bridge.status.network"
      }
    ]
  },
  "status": "active"
} satisfies Chain