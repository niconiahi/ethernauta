/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_141319 = {
  "name": "MagApe Testnet",
  "shortName": "mag",
  "title": "MagApeChain",
  "chain": "MagApe",
  "icon": "magape",
  "rpc": [
    "https://testnet-api.magape.io/chain/"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "MagApe",
    "symbol": "MAG",
    "decimals": 18
  },
  "infoURL": "https://magape.io",
  "chainId": 141319,
  "networkId": 141319,
  "explorers": [
    {
      "name": "etherscan",
      "url": "http://testnet-api.magape.io:81",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain