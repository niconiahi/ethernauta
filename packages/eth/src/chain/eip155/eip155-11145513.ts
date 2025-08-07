/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_11145513 = {
  "name": "Blessnet Sepolia",
  "shortName": "bless-sepolia",
  "chain": "ETH",
  "icon": "bless",
  "rpc": [
    "https://blessnet-sepolia-testnet.rpc.caldera.xyz/http",
    "wss://blessnet-sepolia-testnet.rpc.caldera.xyz/ws"
  ],
  "faucets": [
    "https://blessnet-sepolia-testnet.hub.caldera.xyz"
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
    "name": "Bless",
    "symbol": "BLESS",
    "decimals": 18
  },
  "infoURL": "https://blessnet.io",
  "chainId": 11145513,
  "networkId": 11145513,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blessnet-sepolia-testnet.explorer.caldera.xyz",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-421614",
    "bridges": [
      {
        "url": "https://blessnet-sepolia-testnet.bridge.caldera.xyz"
      }
    ]
  }
} satisfies Chain