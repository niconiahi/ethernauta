/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_170 = {
  "name": "HOO Smart Chain Testnet",
  "shortName": "hoosmartchain",
  "chain": "ETH",
  "rpc": [
    "https://http-testnet.hoosmartchain.com"
  ],
  "faucets": [
    "https://faucet-testnet.hscscan.com/"
  ],
  "nativeCurrency": {
    "name": "HOO",
    "symbol": "HOO",
    "decimals": 18
  },
  "infoURL": "https://www.hoosmartchain.com",
  "chainId": 170,
  "networkId": 170,
  "slip44": 1
} satisfies Chain