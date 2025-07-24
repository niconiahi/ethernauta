/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_298 = {
  "name": "Hedera Localnet",
  "shortName": "hedera-localnet",
  "chain": "Hedera",
  "icon": "hedera",
  "rpc": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "hbar",
    "symbol": "HBAR",
    "decimals": 18
  },
  "infoURL": "https://hedera.com",
  "chainId": 298,
  "networkId": 298,
  "slip44": 3030,
  "explorers": []
} satisfies Chain