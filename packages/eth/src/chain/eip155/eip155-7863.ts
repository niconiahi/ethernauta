/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_7863 = {
  "name": "MaalChain Testnet V2",
  "shortName": "maal-test-v2",
  "chain": "MaalChain Testnet V2",
  "icon": "maal-test",
  "rpc": [
    "https://node-testnet.maalscan.io/",
    "https://node2-testnet.maalscan.io/"
  ],
  "faucets": [
    "https://faucet-new-testnet.maalscan.io/"
  ],
  "nativeCurrency": {
    "name": "MAAL",
    "symbol": "MAAL",
    "decimals": 18
  },
  "infoURL": "https://www.maalchain.com/",
  "chainId": 7863,
  "networkId": 7863,
  "slip44": 1,
  "explorers": [
    {
      "name": "maalscan testnet",
      "url": "https://new-testnet.maalscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain