/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_23 = {
  "name": "ELA-DID-Sidechain Testnet",
  "shortName": "eladidt",
  "chain": "ETH",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Elastos",
    "symbol": "tELA",
    "decimals": 18
  },
  "infoURL": "https://elaeth.io/",
  "chainId": 23,
  "networkId": 23,
  "slip44": 1
} satisfies Chain