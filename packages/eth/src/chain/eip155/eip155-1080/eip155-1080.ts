/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1080 = {
  "name": "Mintara Mainnet",
  "shortName": "mintara",
  "title": "Mintara Mainnet",
  "chain": "Mintara",
  "icon": "mintara",
  "rpc": [
    "https://subnets.avax.network/mintara/mainnet/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MINTARA",
    "symbol": "MNTR",
    "decimals": 18
  },
  "infoURL": "https://playthink.co.jp",
  "chainId": 1080,
  "networkId": 1080,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://subnets.avax.network/mintara",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain