/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3698 = {
  "name": "SenjePowers Testnet",
  "shortName": "SPCt",
  "chain": "SPC",
  "icon": "SenjePowers",
  "rpc": [
    "https://testnet-rpc.senjepowersscan.com"
  ],
  "faucets": [
    "https://faucet.senjepowersscan.com"
  ],
  "nativeCurrency": {
    "name": "SenjePowers",
    "symbol": "SPC",
    "decimals": 18
  },
  "infoURL": "https://senjepowersscan.com",
  "chainId": 3698,
  "networkId": 3698,
  "slip44": 1,
  "explorers": [
    {
      "name": "SenjePowers",
      "url": "https://testnet.senjepowersscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain