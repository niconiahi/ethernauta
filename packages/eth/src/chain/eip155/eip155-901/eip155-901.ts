/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_901 = {
  "name": "Garizon Testnet Stage1",
  "shortName": "gar-test-s1",
  "chain": "GAR",
  "icon": "garizon",
  "rpc": [
    "https://s1-testnet.garizon.net/rpc"
  ],
  "faucets": [
    "https://faucet-testnet.garizon.com"
  ],
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "infoURL": "https://garizon.com",
  "chainId": 901,
  "networkId": 901,
  "slip44": 1,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer-testnet.garizon.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "shard",
    "chain": "eip155-900"
  }
} satisfies Chain