/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_59144 = {
  "name": "Linea",
  "shortName": "linea",
  "title": "Linea Mainnet",
  "chain": "ETH",
  "icon": "linea",
  "rpc": [
    "https://rpc.linea.build",
    "wss://rpc.linea.build",
    "https://linea-mainnet.infura.io/v3/${INFURA_API_KEY}",
    "wss://linea-mainnet.infura.io/ws/v3/${INFURA_API_KEY}"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Linea Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://linea.build",
  "chainId": 59144,
  "networkId": 59144,
  "explorers": [
    {
      "name": "Etherscan",
      "url": "https://lineascan.build",
      "standard": "EIP3091"
    },
    {
      "name": "Blockscout",
      "url": "https://explorer.linea.build",
      "standard": "EIP3091"
    },
    {
      "name": "L2scan",
      "url": "https://linea.l2scan.co",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.linea.build"
      }
    ]
  },
  "status": "active"
} satisfies Chain