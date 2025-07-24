/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1079 = {
  "name": "Mintara Testnet",
  "shortName": "mintara-testnet",
  "title": "Mintara Testnet",
  "chain": "Mintara",
  "icon": "mintara",
  "rpc": [
    "https://subnets.avax.network/mintara/testnet/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MINTARA",
    "symbol": "MNTR",
    "decimals": 18
  },
  "infoURL": "https://playthink.co.jp",
  "chainId": 1079,
  "networkId": 1079,
  "slip44": 1,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://subnets-test.avax.network/mintara",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain