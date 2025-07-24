/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1442 = {
  "name": "Polygon zkEVM Testnet",
  "shortName": "testnet-zkEVM-mango",
  "title": "Polygon zkEVM Testnet",
  "chain": "Polygon",
  "rpc": [
    "https://rpc.public.zkevm-test.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://polygon.technology/solutions/polygon-zkevm/",
  "chainId": 1442,
  "networkId": 1442,
  "slip44": 1,
  "explorers": [
    {
      "name": "Polygon zkEVM explorer",
      "url": "https://explorer.public.zkevm-test.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain