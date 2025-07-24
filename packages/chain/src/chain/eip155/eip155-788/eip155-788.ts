/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_788 = {
  "name": "Aerochain Testnet",
  "shortName": "taero",
  "chain": "Aerochain",
  "rpc": [
    "https://testnet-rpc.aerochain.id/"
  ],
  "faucets": [
    "https://faucet.aerochain.id/"
  ],
  "nativeCurrency": {
    "name": "Aerochain Testnet",
    "symbol": "TAero",
    "decimals": 18
  },
  "infoURL": "https://aerochaincoin.org/",
  "chainId": 788,
  "networkId": 788,
  "slip44": 1,
  "explorers": [
    {
      "name": "aeroscan",
      "url": "https://testnet.aeroscan.id",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain