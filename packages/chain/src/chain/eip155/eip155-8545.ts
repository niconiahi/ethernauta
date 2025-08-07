/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_8545 = {
  "name": "Chakra Testnet",
  "shortName": "ChakraTN",
  "chain": "Chakra Testnet",
  "rpc": [
    "https://rpcv1-dn-1.chakrachain.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Chakra",
    "symbol": "CKR",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 8545,
  "networkId": 8545,
  "explorers": []
} satisfies Chain