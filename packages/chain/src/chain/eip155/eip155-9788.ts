/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9788 = {
  "name": "Tabi Testnetv2",
  "shortName": "tabitestv2",
  "chain": "TabiNetworkv2",
  "rpc": [
    "https://rpc.testnetv2.tabichain.com"
  ],
  "faucets": [
    "https://carnival.tabichain.com"
  ],
  "nativeCurrency": {
    "name": "Tabi",
    "symbol": "TABI",
    "decimals": 18
  },
  "infoURL": "https://www.tabichain.com",
  "chainId": 9788,
  "networkId": 9788,
  "explorers": [
    {
      "name": "Tabi Testnet V2 Explorer",
      "url": "https://testnetv2.tabiscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain