/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_776 = {
  "name": "OpenChain Testnet",
  "shortName": "opc",
  "chain": "OpenChain Testnet",
  "rpc": [],
  "faucets": [
    "https://faucet.openchain.info/"
  ],
  "nativeCurrency": {
    "name": "Openchain Testnet",
    "symbol": "TOPC",
    "decimals": 18
  },
  "infoURL": "https://testnet.openchain.info/",
  "chainId": 776,
  "networkId": 776,
  "slip44": 1,
  "explorers": [
    {
      "name": "OPEN CHAIN TESTNET",
      "url": "https://testnet.openchain.info",
      "standard": "none"
    }
  ]
} satisfies Chain