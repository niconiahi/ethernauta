/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_66 = {
  "name": "OKXChain Mainnet",
  "shortName": "okt",
  "chain": "okxchain",
  "rpc": [
    "https://exchainrpc.okex.org",
    "https://okc-mainnet.gateway.pokt.network/v1/lb/6275309bea1b320039c893ff"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OKXChain Global Utility Token",
    "symbol": "OKT",
    "decimals": 18
  },
  "infoURL": "https://www.okex.com/okc",
  "chainId": 66,
  "networkId": 66,
  "explorers": [
    {
      "name": "OKLink",
      "url": "https://www.oklink.com/en/okc",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain