/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_252 = {
  "name": "Fraxchain Mainnet",
  "shortName": "fraxchain",
  "chain": "FRAX",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Frax Ether",
    "symbol": "frxETH",
    "decimals": 18
  },
  "infoURL": "https://mainnet.frax.com",
  "chainId": 252,
  "networkId": 252,
  "explorers": [],
  "status": "incubating"
} satisfies Chain