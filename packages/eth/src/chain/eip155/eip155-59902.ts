/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_59902 = {
  "name": "Metis Sepolia Testnet",
  "shortName": "metis-sepolia",
  "chain": "ETH",
  "rpc": [
    "https://sepolia.metisdevops.link",
    "https://metis-sepolia-rpc.publicnode.com",
    "wss://metis-sepolia-rpc.publicnode.com"
  ],
  "faucets": [
    "https://sepolia.faucet.metisdevops.link"
  ],
  "nativeCurrency": {
    "name": "tMetis",
    "symbol": "tMETIS",
    "decimals": 18
  },
  "infoURL": "https://www.metis.io",
  "chainId": 59902,
  "networkId": 59902,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://sepolia-explorer.metisdevops.link",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://bridge.metis.io"
      }
    ]
  }
} satisfies Chain