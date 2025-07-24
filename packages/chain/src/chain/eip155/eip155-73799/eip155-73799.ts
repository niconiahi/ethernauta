/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_73799 = {
  "name": "Energy Web Volta Testnet",
  "shortName": "vt",
  "chain": "Volta",
  "rpc": [
    "https://volta-rpc.energyweb.org",
    "wss://volta-rpc.energyweb.org/ws"
  ],
  "faucets": [
    "https://voltafaucet.energyweb.org"
  ],
  "nativeCurrency": {
    "name": "Volta Token",
    "symbol": "VT",
    "decimals": 18
  },
  "infoURL": "https://energyweb.org",
  "chainId": 73799,
  "networkId": 73799,
  "slip44": 1
} satisfies Chain