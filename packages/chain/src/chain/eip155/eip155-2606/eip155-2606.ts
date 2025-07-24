/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2606 = {
  "name": "PoCRNet",
  "shortName": "pocrnet",
  "title": "Proof of Climate awaReness mainnet",
  "chain": "CRC",
  "icon": "pocr",
  "rpc": [
    "https://pocrnet.westeurope.cloudapp.azure.com/http",
    "wss://pocrnet.westeurope.cloudapp.azure.com/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Climate awaReness Coin",
    "symbol": "CRC",
    "decimals": 18
  },
  "infoURL": "https://github.com/ethereum-pocr/pocrnet",
  "chainId": 2606,
  "networkId": 2606,
  "explorers": [
    {
      "name": "Lite Explorer",
      "url": "https://ethereum-pocr.github.io/explorer/pocrnet",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain