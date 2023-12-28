/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1995 = {
  "name": "edeXa Testnet",
  "shortName": "edx",
  "chain": "edeXa TestNetwork",
  "icon": "edexa",
  "rpc": [
    "https://testnet.edexa.com/rpc",
    "https://io-dataseed1.testnet.edexa.io-market.com/rpc"
  ],
  "faucets": [
    "https://faucet.edexa.com/"
  ],
  "nativeCurrency": {
    "name": "EDEXA",
    "symbol": "EDX",
    "decimals": 18
  },
  "infoURL": "https://edexa.com/",
  "chainId": 1995,
  "networkId": 1995,
  "slip44": 1,
  "explorers": [
    {
      "name": "edexa-testnet",
      "url": "https://explorer.testnet.edexa.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain