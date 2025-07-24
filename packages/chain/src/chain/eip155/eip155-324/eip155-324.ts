/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_324 = {
  "name": "zkSync Mainnet",
  "shortName": "zksync",
  "chain": "ETH",
  "icon": "zksync-era",
  "rpc": [
    "https://mainnet.era.zksync.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://zksync.io/",
  "chainId": 324,
  "networkId": 324,
  "explorers": [
    {
      "name": "zkSync Era Block Explorer",
      "url": "https://explorer.zksync.io",
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
  }
} satisfies Chain