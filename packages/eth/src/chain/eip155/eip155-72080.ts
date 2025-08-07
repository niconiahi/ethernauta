/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_72080 = {
  "name": "Nexera Testnet",
  "shortName": "nxra-testnet",
  "chain": "Nexera",
  "rpc": [
    "https://rpc.testnet.nexera.network"
  ],
  "faucets": [
    "https://faucet.nexera.network"
  ],
  "nativeCurrency": {
    "name": "tNXRA",
    "symbol": "tNXRA",
    "decimals": 18
  },
  "infoURL": "https://testnet.nexera.network",
  "chainId": 72080,
  "networkId": 72080,
  "explorers": []
} satisfies Chain