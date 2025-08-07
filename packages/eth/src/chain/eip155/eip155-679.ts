/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_679 = {
  "name": "Janction Testnet",
  "shortName": "janction_testnet",
  "chain": "Janction Testnet",
  "icon": "janction",
  "rpc": [
    "https://rpc_testnet.janction.io",
    "wss://rpc_testnet.janction.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Janction",
    "symbol": "JCT",
    "decimals": 18
  },
  "infoURL": "https://janction.io",
  "chainId": 679,
  "networkId": 679,
  "explorers": [],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": []
  }
} satisfies Chain