/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_6688 = {
  "name": "IRIShub",
  "shortName": "iris",
  "chain": "IRIShub",
  "icon": "irishub",
  "rpc": [
    "https://evmrpc.irishub-1.irisnet.org",
    "https://iris-evm.publicnode.com",
    "wss://iris-evm.publicnode.com"
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
    "name": "Eris",
    "symbol": "ERIS",
    "decimals": 18
  },
  "infoURL": "https://www.irisnet.org",
  "chainId": 6688,
  "networkId": 6688,
  "explorers": [
    {
      "name": "IRISHub Cosmos Explorer (IOBScan)",
      "url": "https://irishub.iobscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain