/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_71401 = {
  "name": "Godwoken Testnet v1",
  "shortName": "gw-testnet-v1",
  "chain": "GWT",
  "rpc": [
    "https://godwoken-testnet-v1.ckbapp.dev",
    "https://v1.testnet.godwoken.io/rpc"
  ],
  "faucets": [
    "https://testnet.bridge.godwoken.io"
  ],
  "nativeCurrency": {
    "name": "pCKB",
    "symbol": "pCKB",
    "decimals": 18
  },
  "infoURL": "https://www.nervos.org",
  "chainId": 71401,
  "networkId": 71401,
  "slip44": 1,
  "explorers": [
    {
      "name": "GWScan Block Explorer",
      "url": "https://v1.testnet.gwscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain