/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2021 = {
  "name": "Edgeware EdgeEVM Mainnet",
  "shortName": "edg",
  "chain": "EDG",
  "icon": "edgeware",
  "rpc": [
    "https://edgeware-evm.jelliedowl.net",
    "https://mainnet2.edgewa.re/evm",
    "https://mainnet3.edgewa.re/evm",
    "https://mainnet4.edgewa.re/evm",
    "https://mainnet5.edgewa.re/evm",
    "wss://edgeware.jelliedowl.net",
    "wss://mainnet2.edgewa.re",
    "wss://mainnet3.edgewa.re",
    "wss://mainnet4.edgewa.re",
    "wss://mainnet5.edgewa.re"
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
    "name": "Edgeware",
    "symbol": "EDG",
    "decimals": 18
  },
  "infoURL": "https://edgeware.io",
  "chainId": 2021,
  "networkId": 2021,
  "slip44": 523,
  "explorers": [
    {
      "name": "Edgscan by Bharathcoorg",
      "url": "https://edgscan.live",
      "standard": "EIP3091"
    },
    {
      "name": "Subscan",
      "url": "https://edgeware.subscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain