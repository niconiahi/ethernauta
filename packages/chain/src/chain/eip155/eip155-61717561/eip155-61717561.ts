/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_61717561 = {
  "name": "Aquachain",
  "shortName": "aqua",
  "chain": "AQUA",
  "rpc": [
    "https://c.onical.org",
    "https://tx.aquacha.in/api"
  ],
  "faucets": [
    "https://aquacha.in/faucet"
  ],
  "nativeCurrency": {
    "name": "Aquachain Ether",
    "symbol": "AQUA",
    "decimals": 18
  },
  "infoURL": "https://aquachain.github.io",
  "chainId": 61717561,
  "networkId": 61717561,
  "slip44": 61717561
} satisfies Chain