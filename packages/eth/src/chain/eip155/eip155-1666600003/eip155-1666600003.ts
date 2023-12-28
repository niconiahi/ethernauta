/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1666600003 = {
  "name": "Harmony Mainnet Shard 3",
  "shortName": "hmy-s3",
  "chain": "Harmony",
  "rpc": [
    "https://api.s3.t.hmny.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "chainId": 1666600003,
  "networkId": 1666600003,
  "slip44": 1023,
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.harmony.one/blocks/shard/3",
      "standard": "none"
    }
  ],
  "status": "deprecated"
} satisfies Chain