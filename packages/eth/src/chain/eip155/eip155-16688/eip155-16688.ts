/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_16688 = {
  "name": "IRIShub Testnet",
  "shortName": "nyancat",
  "chain": "IRIShub",
  "icon": "nyancat",
  "rpc": [
    "https://evmrpc.nyancat.irisnet.org"
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
  "chainId": 16688,
  "networkId": 16688,
  "slip44": 1,
  "explorers": [
    {
      "name": "IRISHub Testnet Cosmos Explorer (IOBScan)",
      "url": "https://nyancat.iobscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain