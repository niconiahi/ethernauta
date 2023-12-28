/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1666600000 = {
  "name": "Harmony Mainnet Shard 0",
  "shortName": "hmy-s0",
  "chain": "Harmony",
  "rpc": [
    "https://api.harmony.one",
    "https://a.api.s0.t.hmny.io",
    "https://api.s0.t.hmny.io",
    "https://rpc.ankr.com/harmony",
    "https://harmony.api.onfinality.io/public",
    "https://1rpc.io/one"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "chainId": 1666600000,
  "networkId": 1666600000,
  "slip44": 1023,
  "ens": {
    "registry": "0x4cd2563118e57b19179d8dc033f2b0c5b5d69ff5"
  },
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.harmony.one",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain