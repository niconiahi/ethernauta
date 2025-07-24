/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_256 = {
  "name": "Huobi ECO Chain Testnet",
  "shortName": "hecot",
  "chain": "Heco",
  "rpc": [
    "https://http-testnet.hecochain.com",
    "wss://ws-testnet.hecochain.com"
  ],
  "faucets": [
    "https://scan-testnet.hecochain.com/faucet"
  ],
  "nativeCurrency": {
    "name": "Huobi ECO Chain Test Native Token",
    "symbol": "htt",
    "decimals": 18
  },
  "infoURL": "https://testnet.hecoinfo.com",
  "chainId": 256,
  "networkId": 256
} satisfies Chain