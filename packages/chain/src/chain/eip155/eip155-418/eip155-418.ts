/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_418 = {
  "name": "LaTestnet",
  "shortName": "latestnet",
  "chain": "LaTestnet",
  "icon": "lachain-network",
  "rpc": [
    "https://rpc.testnet.lachain.network",
    "https://lachain-testnet.rpc-nodes.cedalio.dev"
  ],
  "faucets": [
    "https://faucet.lachain.network"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Test LaCoin",
    "symbol": "TLA",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 418,
  "networkId": 418,
  "explorers": [
    {
      "name": "LaTestnet Explorer",
      "url": "https://testexplorer.lachain.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain