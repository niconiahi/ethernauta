/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1133 = {
  "name": "DeFiMetaChain Changi Testnet",
  "shortName": "changi",
  "chain": "DFI",
  "icon": "defichain-network",
  "rpc": [
    "https://dmc.mydefichain.com/changi",
    "https://testnet-dmc.mydefichain.com:20551"
  ],
  "faucets": [
    "http://tc04.mydefichain.com/faucet"
  ],
  "nativeCurrency": {
    "name": "DeFiChain Token",
    "symbol": "DFI",
    "decimals": 18
  },
  "infoURL": "https://meta.defichain.com",
  "chainId": 1133,
  "networkId": 1133,
  "explorers": [
    {
      "name": "MetaScan",
      "url": "https://meta.defiscan.live",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain