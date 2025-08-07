/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_19850818 = {
  "name": "DeepBrainChain Testnet",
  "shortName": "tDBC",
  "chain": "DeepBrainChain",
  "icon": "dbc",
  "rpc": [
    "https://rpc-testnet.dbcwallet.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DeepBrainChain",
    "symbol": "tDBC",
    "decimals": 18
  },
  "infoURL": "https://www.deepbrainchain.org",
  "chainId": 19850818,
  "networkId": 19850818,
  "slip44": 1,
  "explorers": [
    {
      "name": "DeepBrainChain Testnet",
      "url": "https://testnet.dbcscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain