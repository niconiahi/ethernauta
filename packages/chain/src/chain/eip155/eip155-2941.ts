/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2941 = {
  "name": "Xenon Chain Testnet",
  "shortName": "xenon",
  "chain": "XEN",
  "icon": "xenon",
  "rpc": [
    "https://testnet-chain.xenonchain.com/",
    "https://testnet-dev.xenonchain.com/"
  ],
  "faucets": [
    "https://xfaucet.xenonchain.com"
  ],
  "nativeCurrency": {
    "name": "Xenon Testnet",
    "symbol": "tXEN",
    "decimals": 18
  },
  "infoURL": "https://xenonchain.com",
  "chainId": 2941,
  "networkId": 2941,
  "slip44": 1,
  "explorers": [
    {
      "name": "Xenon testnet Explorer",
      "url": "https://testnet.xenonchain.com",
      "standard": "none"
    }
  ]
} satisfies Chain