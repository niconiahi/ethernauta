/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_8922 = {
  "name": "Algen Layer2 Testnet",
  "shortName": "algl2Test",
  "chain": "ALG L2",
  "icon": "algl2",
  "rpc": [
    "https://rpc.alg2-test.algen.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ALG",
    "symbol": "ALG",
    "decimals": 18
  },
  "infoURL": "https://www.algen.network",
  "chainId": 8922,
  "networkId": 8922,
  "explorers": [
    {
      "name": "algl2scan",
      "url": "https://scan.alg2-test.algen.network",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-8921"
  }
} satisfies Chain