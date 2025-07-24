/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_8724 = {
  "name": "TOOL Global Testnet",
  "shortName": "tolo",
  "chain": "OLO",
  "rpc": [
    "https://testnet-web3.wolot.io"
  ],
  "faucets": [
    "https://testnet-explorer.wolot.io"
  ],
  "nativeCurrency": {
    "name": "TOOL Global",
    "symbol": "OLO",
    "decimals": 18
  },
  "infoURL": "https://testnet-explorer.wolot.io",
  "chainId": 8724,
  "networkId": 8724,
  "slip44": 1
} satisfies Chain