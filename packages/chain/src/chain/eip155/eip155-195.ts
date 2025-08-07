/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_195 = {
  "name": "X Layer Testnet",
  "shortName": "tokb",
  "chain": "X Layer",
  "icon": "xlayerTestnet",
  "rpc": [
    "https://testrpc.xlayer.tech",
    "https://xlayertestrpc.okx.com"
  ],
  "faucets": [
    "https://www.okx.com/xlayer/faucet"
  ],
  "features": [],
  "nativeCurrency": {
    "name": "X Layer Global Utility Token in testnet",
    "symbol": "OKB",
    "decimals": 18
  },
  "infoURL": "https://www.okx.com/xlayer",
  "chainId": 195,
  "networkId": 195,
  "slip44": 1,
  "explorers": [
    {
      "name": "OKLink",
      "url": "https://www.oklink.com/xlayer-test",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain