/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_160 = {
  "name": "Armonia Eva Chain Mainnet",
  "shortName": "eva",
  "chain": "Eva",
  "rpc": [
    "https://evascan.io/api/eth-rpc/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Armonia Multichain Native Token",
    "symbol": "AMAX",
    "decimals": 18
  },
  "infoURL": "https://amax.network",
  "chainId": 160,
  "networkId": 160,
  "status": "incubating"
} satisfies Chain