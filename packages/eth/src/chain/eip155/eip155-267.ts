/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_267 = {
  "name": "Neura Testnet",
  "shortName": "tneura",
  "title": "Neura Testnet",
  "chain": "NEURA",
  "icon": "neura",
  "rpc": [
    "https://rpc.ankr.com/neura_testnet"
  ],
  "faucets": [
    "https://testnet.neuraprotocol.io/faucet"
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
    "name": "Testnet Ankr",
    "symbol": "ANKR",
    "decimals": 18
  },
  "infoURL": "https://www.neuraprotocol.io/",
  "chainId": 267,
  "networkId": 267,
  "slip44": 1,
  "explorers": [
    {
      "name": "ankrscan-neura",
      "url": "https://testnet.explorer.neuraprotocol.io",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout",
      "url": "https://explorer.neura-testnet.ankr.com",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain