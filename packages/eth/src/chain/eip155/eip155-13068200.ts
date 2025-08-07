/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_13068200 = {
  "name": "COTI Devnet",
  "shortName": "coti-devnet",
  "title": "COTI Devnet",
  "chain": "COTI",
  "icon": "coti",
  "rpc": [
    "https://devnet.coti.io/rpc"
  ],
  "faucets": [
    "https://faucet.coti.io"
  ],
  "nativeCurrency": {
    "name": "COTI2",
    "symbol": "COTI2",
    "decimals": 18
  },
  "infoURL": "https://coti.io/",
  "chainId": 13068200,
  "networkId": 13068200,
  "explorers": [
    {
      "name": "coti devnet explorer",
      "url": "https://explorer-devnet.coti.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain