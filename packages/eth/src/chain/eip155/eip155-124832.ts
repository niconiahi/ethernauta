/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_124832 = {
  "name": "Mitosis Testnet",
  "shortName": "mitosis-testnet",
  "chain": "Mitosis Testnet",
  "rpc": [
    "https://rpc.testnet.mitosis.org"
  ],
  "faucets": [
    "https://testnet.mitosis.org/faucet"
  ],
  "nativeCurrency": {
    "name": "MITO",
    "symbol": "MITO",
    "decimals": 18
  },
  "infoURL": "https://mitosis.org",
  "chainId": 124832,
  "networkId": 124832,
  "explorers": [
    {
      "name": "mitosis testnet explorer",
      "url": "https://testnet.mitosiscan.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain