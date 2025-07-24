/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2138 = {
  "name": "Defi Oracle Meta Testnet",
  "shortName": "dfio-meta-test",
  "chain": "dfiometatest",
  "icon": "defioraclemeta",
  "rpc": [
    "https://rpc.public-2138.defi-oracle.io",
    "wss://rpc.public-2138.defi-oracle.io"
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
    "name": "testEther",
    "symbol": "tETH",
    "decimals": 18
  },
  "infoURL": "https://defi-oracle.io/",
  "chainId": 2138,
  "networkId": 21,
  "slip44": 1,
  "ens": {
    "registry": "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85"
  },
  "explorers": [
    {
      "name": "Quorum Explorer",
      "url": "https://public-2138.defi-oracle.io",
      "standard": "none"
    }
  ]
} satisfies Chain