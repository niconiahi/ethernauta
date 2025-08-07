/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_89 = {
  "name": "Viction Testnet",
  "shortName": "vict",
  "chain": "Viction",
  "rpc": [
    "https://rpc-testnet.viction.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Viction",
    "symbol": "VIC",
    "decimals": 18
  },
  "infoURL": "https://viction.xyz",
  "chainId": 89,
  "networkId": 89,
  "slip44": 1
} satisfies Chain