/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_79479957 = {
  "name": "SX Toronto Rollup",
  "shortName": "SXR-Testnet",
  "chain": "SX",
  "icon": "SX",
  "rpc": [
    "https://rpc.sx-rollup-testnet.t.raas.gelato.cloud"
  ],
  "faucets": [
    "https://faucet.toronto.sx.technology"
  ],
  "nativeCurrency": {
    "name": "SX Network",
    "symbol": "SX",
    "decimals": 18
  },
  "infoURL": "https://www.sx.technology",
  "chainId": 79479957,
  "networkId": 79479957,
  "explorers": [
    {
      "name": "SX Toronto L2 Explorer",
      "url": "https://explorerl2.toronto.sx.technology",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111"
  }
} satisfies Chain