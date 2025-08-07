/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2021 = {
  "name": "Edgeware EdgeEVM Mainnet",
  "shortName": "edg",
  "chain": "EDG",
  "icon": "edgeware",
  "rpc": [
    "https://edgeware-evm.jelliedowl.net",
    "https://edgeware-evm0.jelliedowl.net",
    "https://edgeware-evm1.jelliedowl.net",
    "https://edgeware-evm2.jelliedowl.net",
    "https://edgeware-evm3.jelliedowl.net",
    "wss://edgeware.jelliedowl.net",
    "wss://edgeware-rpc0.jelliedowl.net",
    "wss://edgeware-rpc1.jelliedowl.net",
    "wss://edgeware-rpc2.jelliedowl.net",
    "wss://edgeware-rpc3.jelliedowl.net"
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
      "name": "Edgscan EdgeEVM explorer by Bharathcoorg",
      "url": "https://edgscan.live",
      "standard": "EIP3091"
    },
    {
      "name": "Edgscan EdgeWASM explorer by Bharathcoorg",
      "url": "https://edgscan.ink",
      "standard": "none"
    }
  ]
} satisfies Chain