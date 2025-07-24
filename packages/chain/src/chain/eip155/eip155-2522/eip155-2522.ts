/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2522 = {
  "name": "Fraxchain Testnet",
  "shortName": "fraxchain-testnet",
  "chain": "FRAX",
  "rpc": [
    "https://rpc.testnet.frax.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Frax Ether",
    "symbol": "frxETH",
    "decimals": 18
  },
  "infoURL": "https://testnet.frax.com",
  "chainId": 2522,
  "networkId": 2522,
  "slip44": 1,
  "explorers": [],
  "status": "active"
} satisfies Chain