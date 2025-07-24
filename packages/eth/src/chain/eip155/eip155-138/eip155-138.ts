/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_138 = {
  "name": "Defi Oracle Meta Mainnet",
  "shortName": "dfio-meta-main",
  "chain": "dfiometa",
  "icon": "defioraclemeta",
  "rpc": [
    "https://rpc.public-0138.defi-oracle.io",
    "wss://rpc.public-0138.defi-oracle.io"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://defi-oracle.io/",
  "chainId": 138,
  "networkId": 1,
  "slip44": 60,
  "ens": {
    "registry": "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85"
  },
  "explorers": [
    {
      "name": "Quorum Explorer",
      "url": "https://public-0138.defi-oracle.io",
      "standard": "none"
    }
  ]
} satisfies Chain