/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_123 = {
  "name": "Fuse Sparknet",
  "shortName": "spark",
  "chain": "fuse",
  "rpc": [
    "https://rpc.fusespark.io"
  ],
  "faucets": [
    "https://get.fusespark.io"
  ],
  "nativeCurrency": {
    "name": "Spark",
    "symbol": "SPARK",
    "decimals": 18
  },
  "infoURL": "https://docs.fuse.io/general/fuse-network-blockchain/fuse-testnet",
  "chainId": 123,
  "networkId": 123
} satisfies Chain