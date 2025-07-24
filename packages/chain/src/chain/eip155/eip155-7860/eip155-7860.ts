/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_7860 = {
  "name": "MaalChain Testnet",
  "shortName": "maal-test",
  "chain": "MaalChain Testnet",
  "icon": "maal-test",
  "rpc": [
    "https://node1.maalscan.io/",
    "https://rpc-bntest.maalscan.io/"
  ],
  "faucets": [
    "https://faucet-testnet.maalscan.io/"
  ],
  "nativeCurrency": {
    "name": "MAAL",
    "symbol": "MAAL",
    "decimals": 18
  },
  "infoURL": "https://www.maalchain.com/",
  "chainId": 7860,
  "networkId": 7860,
  "slip44": 1,
  "explorers": [
    {
      "name": "maalscan testnet",
      "url": "https://testnet.maalscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain