/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_245022926 = {
  "name": "Neon EVM Devnet",
  "shortName": "neonevm-devnet",
  "chain": "Solana",
  "icon": "neon",
  "rpc": [
    "https://devnet.neonevm.org"
  ],
  "faucets": [
    "https://neonfaucet.org"
  ],
  "nativeCurrency": {
    "name": "Neon",
    "symbol": "NEON",
    "decimals": 18
  },
  "infoURL": "https://neon-labs.org",
  "chainId": 245022926,
  "networkId": 245022926,
  "explorers": [
    {
      "name": "neonscan",
      "url": "https://devnet.neonscan.org",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout",
      "url": "https://neon-devnet.blockscout.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain