/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1998 = {
  "name": "Kyoto Testnet",
  "shortName": "kyoto-testnet",
  "chain": "KYOTO",
  "rpc": [
    "https://rpc.testnet.kyotoprotocol.io:8545"
  ],
  "faucets": [
    "https://faucet.kyotoprotocol.io"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Kyoto",
    "symbol": "KYOTO",
    "decimals": 18
  },
  "infoURL": "https://kyotoprotocol.io",
  "chainId": 1998,
  "networkId": 1998,
  "slip44": 1,
  "explorers": [
    {
      "name": "Kyotoscan",
      "url": "https://testnet.kyotoscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain