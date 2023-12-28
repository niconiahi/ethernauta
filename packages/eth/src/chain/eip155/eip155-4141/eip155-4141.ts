/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4141 = {
  "name": "Tipboxcoin Testnet",
  "shortName": "TPBXt",
  "chain": "TPBX",
  "icon": "tipboxcoinIcon",
  "rpc": [
    "https://testnet-rpc.tipboxcoin.net"
  ],
  "faucets": [
    "https://faucet.tipboxcoin.net"
  ],
  "nativeCurrency": {
    "name": "Tipboxcoin",
    "symbol": "TPBX",
    "decimals": 18
  },
  "infoURL": "https://tipboxcoin.net",
  "chainId": 4141,
  "networkId": 4141,
  "slip44": 1,
  "explorers": [
    {
      "name": "Tipboxcoin",
      "url": "https://testnet.tipboxcoin.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain