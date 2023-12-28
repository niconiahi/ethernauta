/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_280 = {
  "name": "zkSync Era Goerli Testnet (deprecated)",
  "shortName": "zksync-goerli",
  "chain": "ETH",
  "icon": "zksync-era",
  "rpc": [
    "https://testnet.era.zksync.dev"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://zksync.io/",
  "chainId": 280,
  "networkId": 280,
  "slip44": 1,
  "explorers": [
    {
      "name": "zkSync Era Block Explorer",
      "url": "https://goerli.explorer.zksync.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.zksync.io/"
      }
    ]
  },
  "status": "deprecated"
} satisfies Chain