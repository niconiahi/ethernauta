/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_421611 = {
  "name": "Arbitrum Rinkeby",
  "shortName": "arb-rinkeby",
  "title": "Arbitrum Testnet Rinkeby",
  "chain": "ETH",
  "rpc": [
    "https://rinkeby.arbitrum.io/rpc"
  ],
  "faucets": [
    "http://fauceth.komputing.org?chain=421611&address=${ADDRESS}"
  ],
  "nativeCurrency": {
    "name": "Arbitrum Rinkeby Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://arbitrum.io",
  "chainId": 421611,
  "networkId": 421611,
  "slip44": 1,
  "explorers": [
    {
      "name": "arbiscan-testnet",
      "url": "https://testnet.arbiscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "arbitrum-rinkeby",
      "url": "https://rinkeby-explorer.arbitrum.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-4",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io"
      }
    ]
  }
} satisfies Chain