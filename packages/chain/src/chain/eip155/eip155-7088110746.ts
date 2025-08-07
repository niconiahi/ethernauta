/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_7088110746 = {
  "name": "pectra-devnet-5",
  "shortName": "pectra5",
  "chain": "ETH",
  "icon": "ethereum",
  "rpc": [
    "https://rpc.pectra-devnet-5.ethpandaops.io"
  ],
  "faucets": [
    "https://faucet.pectra-devnet-5.ethpandaops.io"
  ],
  "nativeCurrency": {
    "name": "Testnet ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://pectra-devnet-5.ethpandaops.io",
  "chainId": 7088110746,
  "networkId": 7088110746,
  "explorers": [
    {
      "name": "Explorer",
      "url": "https://explorer.pectra-devnet-5.ethpandaops.io",
      "standard": "EIP3091"
    }
  ],
  "status": "incubating"
} satisfies Chain