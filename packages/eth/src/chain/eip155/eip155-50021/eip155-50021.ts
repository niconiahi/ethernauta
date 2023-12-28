/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_50021 = {
  "name": "GTON Testnet",
  "shortName": "tgton",
  "chain": "GTON Testnet",
  "rpc": [
    "https://testnet.gton.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GCD",
    "symbol": "GCD",
    "decimals": 18
  },
  "infoURL": "https://gton.capital",
  "chainId": 50021,
  "networkId": 50021,
  "slip44": 1,
  "explorers": [
    {
      "name": "GTON Testnet Network Explorer",
      "url": "https://explorer.testnet.gton.network",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-3"
  }
} satisfies Chain