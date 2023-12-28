/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4690 = {
  "name": "IoTeX Network Testnet",
  "shortName": "iotex-testnet",
  "chain": "iotex.io",
  "rpc": [
    "https://babel-api.testnet.iotex.io"
  ],
  "faucets": [
    "https://faucet.iotex.io/"
  ],
  "nativeCurrency": {
    "name": "IoTeX",
    "symbol": "IOTX",
    "decimals": 18
  },
  "infoURL": "https://iotex.io",
  "chainId": 4690,
  "networkId": 4690,
  "slip44": 1,
  "explorers": [
    {
      "name": "testnet iotexscan",
      "url": "https://testnet.iotexscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain