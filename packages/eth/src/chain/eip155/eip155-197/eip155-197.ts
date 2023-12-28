/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_197 = {
  "name": "Neutrinos TestNet",
  "shortName": "NEUTR",
  "chain": "NEUTR",
  "rpc": [
    "https://testnet-rpc.neutrinoschain.com"
  ],
  "faucets": [
    "https://neutrinoschain.com/faucet"
  ],
  "nativeCurrency": {
    "name": "Neutrinos",
    "symbol": "NEUTR",
    "decimals": 18
  },
  "infoURL": "https://docs.neutrinoschain.com",
  "chainId": 197,
  "networkId": 197,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.neutrinoschain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain