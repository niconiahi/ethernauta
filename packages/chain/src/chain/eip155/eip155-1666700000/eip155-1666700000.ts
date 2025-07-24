/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1666700000 = {
  "name": "Harmony Testnet Shard 0",
  "shortName": "hmy-b-s0",
  "chain": "Harmony",
  "rpc": [
    "https://api.s0.b.hmny.io"
  ],
  "faucets": [
    "https://faucet.pops.one"
  ],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "chainId": 1666700000,
  "networkId": 1666700000,
  "explorers": [
    {
      "name": "Harmony Testnet Block Explorer",
      "url": "https://explorer.testnet.harmony.one",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain