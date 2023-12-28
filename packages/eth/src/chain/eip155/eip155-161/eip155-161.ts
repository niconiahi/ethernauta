/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_161 = {
  "name": "Armonia Eva Chain Testnet",
  "shortName": "wall-e",
  "chain": "Wall-e",
  "rpc": [
    "https://testnet.evascan.io/api/eth-rpc/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Armonia Multichain Native Token",
    "symbol": "AMAX",
    "decimals": 18
  },
  "infoURL": "https://amax.network",
  "chainId": 161,
  "networkId": 161,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout - evascan",
      "url": "https://testnet.evascan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain