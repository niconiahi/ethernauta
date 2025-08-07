/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4352 = {
  "name": "MemeCore",
  "shortName": "m",
  "title": "MemeCore",
  "chain": "MemeCore",
  "icon": "memecore",
  "rpc": [
    "https://rpc.memecore.net",
    "wss://ws.memecore.net"
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
    "name": "M",
    "symbol": "M",
    "decimals": 18
  },
  "infoURL": "https://memecore.com",
  "chainId": 4352,
  "networkId": 4352,
  "explorers": [
    {
      "name": "OKX-MemeCore",
      "url": "https://www.okx.com/web3/explorer/memecore",
      "standard": "EIP3091"
    },
    {
      "name": "MemeCoreScan",
      "url": "https://memecorescan.io",
      "standard": "EIP3091"
    },
    {
      "name": "MemeCore explorer",
      "url": "https://blockscout.memecore.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain