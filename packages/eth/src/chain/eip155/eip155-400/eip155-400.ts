/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_400 = {
  "name": "HyperonChain TestNet",
  "shortName": "hpn",
  "chain": "HPN",
  "icon": "hyperonchain",
  "rpc": [
    "https://testnet-rpc.hyperonchain.com"
  ],
  "faucets": [
    "https://faucet.hyperonchain.com"
  ],
  "nativeCurrency": {
    "name": "HyperonChain",
    "symbol": "HPN",
    "decimals": 18
  },
  "infoURL": "https://docs.hyperonchain.com",
  "chainId": 400,
  "networkId": 400,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.hyperonchain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain