/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2031 = {
  "name": "Centrifuge",
  "shortName": "cfg",
  "chain": "CFG",
  "rpc": [
    "wss://fullnode.parachain.centrifuge.io"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Centrifuge",
    "symbol": "CFG",
    "decimals": 18
  },
  "infoURL": "https://centrifuge.io",
  "chainId": 2031,
  "networkId": 2031,
  "explorers": [
    {
      "name": "subscan",
      "url": "https://centrifuge.subscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain