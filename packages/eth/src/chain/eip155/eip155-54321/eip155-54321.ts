/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_54321 = {
  "name": "Toronet Testnet",
  "shortName": "ToronetTestnet",
  "chain": "Toronet",
  "icon": "toronet",
  "rpc": [
    "http://testnet.toronet.org/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Toro",
    "symbol": "TORO",
    "decimals": 18
  },
  "infoURL": "https://toronet.org",
  "chainId": 54321,
  "networkId": 54321,
  "slip44": 1,
  "ens": {
    "registry": "0x059C474f26D65B0458F9da10A649a7322aB02C09"
  },
  "explorers": [
    {
      "name": "toronet_explorer",
      "url": "https://testnet.toronet.org",
      "standard": "none"
    }
  ]
} satisfies Chain