/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_65 = {
  "name": "OKExChain Testnet",
  "shortName": "tokt",
  "chain": "okexchain",
  "rpc": [
    "https://exchaintestrpc.okex.org"
  ],
  "faucets": [
    "https://www.okex.com/drawdex"
  ],
  "nativeCurrency": {
    "name": "OKExChain Global Utility Token in testnet",
    "symbol": "OKT",
    "decimals": 18
  },
  "infoURL": "https://www.okex.com/okexchain",
  "chainId": 65,
  "networkId": 65,
  "slip44": 1,
  "explorers": [
    {
      "name": "OKLink",
      "url": "https://www.oklink.com/okexchain-test",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain