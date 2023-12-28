/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_72 = {
  "name": "DxChain Testnet",
  "shortName": "dxc",
  "chain": "DxChain",
  "rpc": [
    "https://testnet-http.dxchain.com"
  ],
  "faucets": [
    "https://faucet.dxscan.io"
  ],
  "nativeCurrency": {
    "name": "DxChain Testnet",
    "symbol": "DX",
    "decimals": 18
  },
  "infoURL": "https://testnet.dxscan.io/",
  "chainId": 72,
  "networkId": 72,
  "slip44": 1
} satisfies Chain