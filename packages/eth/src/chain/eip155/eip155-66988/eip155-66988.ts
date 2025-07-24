/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_66988 = {
  "name": "Janus Testnet",
  "shortName": "janusnetwork-testnet",
  "chain": "JanusNetwork",
  "icon": "janusnetwork",
  "rpc": [
    "https://rpc.test.janusnetwork.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Janus",
    "symbol": "JNS",
    "decimals": 18
  },
  "infoURL": "https://janus-network.gitbook.io/janus",
  "chainId": 66988,
  "networkId": 66988,
  "slip44": 1,
  "explorers": [
    {
      "name": "JanusNetwork Testnet Explorer",
      "url": "https://beta.scan.janusnetwork.io",
      "standard": "none"
    }
  ],
  "status": "active"
} satisfies Chain