/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2442 = {
  "name": "Polygon zkEVM Cardona Testnet",
  "shortName": "zkevm-testnet-cardona",
  "title": "Polygon zkEVM Cardona Testnet",
  "chain": "Polygon",
  "icon": "zkevm",
  "rpc": [
    "https://rpc.cardona.zkevm-rpc.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://polygon.technology/polygon-zkevm",
  "chainId": 2442,
  "networkId": 2442,
  "explorers": [
    {
      "name": "polygonscan",
      "url": "https://cardona-zkevm.polygonscan.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://bridge-ui.cardona.zkevm-rpc.com"
      }
    ]
  }
} satisfies Chain