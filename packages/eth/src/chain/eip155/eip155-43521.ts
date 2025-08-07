/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_43521 = {
  "name": "Formicarium",
  "shortName": "form",
  "title": "MemeCore Testnet Formicarium",
  "chain": "MemeCore",
  "icon": "memecore",
  "rpc": [
    "https://rpc.formicarium.memecore.net",
    "wss://ws.formicarium.memecore.net"
  ],
  "faucets": [
    "https://faucet.memecore.com/formicarium"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Formicarium M",
    "symbol": "M",
    "decimals": 18
  },
  "infoURL": "https://memecore.com",
  "chainId": 43521,
  "networkId": 43521,
  "slip44": 1,
  "explorers": [
    {
      "name": "OKX-Formicarium",
      "url": "https://www.okx.com/web3/explorer/formicarium-testnet",
      "standard": "EIP3091"
    },
    {
      "name": "MemeCoreScan-Formicarium",
      "url": "https://formicarium.memecorescan.io",
      "standard": "EIP3091"
    },
    {
      "name": "MemeCore Testnet Formicarium Explorer",
      "url": "https://formicarium.blockscout.memecore.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain