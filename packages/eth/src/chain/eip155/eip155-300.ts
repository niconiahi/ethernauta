/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_300 = {
  "name": "zkSync Sepolia Testnet",
  "shortName": "zksync-sepolia",
  "chain": "ETH",
  "icon": "zksync-era",
  "rpc": [
    "https://sepolia.era.zksync.dev",
    "https://zksync-sepolia.drpc.org",
    "wss://zksync-sepolia.drpc.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://zksync.io/",
  "chainId": 300,
  "networkId": 300,
  "slip44": 1,
  "explorers": [
    {
      "name": "zkSync Block Explorer",
      "url": "https://sepolia.explorer.zksync.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://bridge.zksync.io/"
      }
    ]
  },
  "redFlags": [
    "reusedChainId"
  ]
} satisfies Chain