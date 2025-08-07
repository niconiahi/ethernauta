/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1686 = {
  "name": "Mint Testnet",
  "shortName": "minttest",
  "chain": "ETH",
  "icon": "mintTestnet",
  "rpc": [
    "https://testnet-rpc.mintchain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://www.mintchain.io",
  "chainId": 1686,
  "networkId": 1686,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet-explorer.mintchain.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://testnet-bridge.mintchain.io"
      }
    ]
  },
  "status": "deprecated"
} satisfies Chain