/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_16350 = {
  "name": "Incentiv Devnet",
  "shortName": "tIncentiv",
  "chain": "Incentiv",
  "rpc": [
    "https://rpc.ankr.com/incentiv_devnet"
  ],
  "faucets": [
    "https://faucet.incentiv-dev.ankr.network"
  ],
  "nativeCurrency": {
    "name": "Testnet INC",
    "symbol": "INC",
    "decimals": 18
  },
  "infoURL": "https://incentiv.net",
  "chainId": 16350,
  "networkId": 16350,
  "slip44": 1
} satisfies Chain