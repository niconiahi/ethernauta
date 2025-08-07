/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_552981 = {
  "name": "One World Chain Testnet",
  "shortName": "OWCTt",
  "chain": "One World Chain",
  "icon": "oneWorldChainIcon",
  "rpc": [
    "https://testnet-rpc.oneworldchain.org"
  ],
  "faucets": [
    "https://faucet.oneworldchain.org"
  ],
  "nativeCurrency": {
    "name": "OWCT",
    "symbol": "OWCT",
    "decimals": 18
  },
  "infoURL": "https://oneworldchain.org",
  "chainId": 552981,
  "networkId": 552981,
  "explorers": [
    {
      "name": "One World Chain Testnet Explorer",
      "url": "https://testnet.oneworldchain.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain