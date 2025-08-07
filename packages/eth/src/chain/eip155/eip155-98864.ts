/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_98864 = {
  "name": "Plume Devnet (Legacy)",
  "shortName": "plume-devnet",
  "title": "Plume Sepolia L2 Rollup Devnet (Legacy)",
  "chain": "PLUME Devnet Legacy",
  "icon": "plume",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Plume Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://plume.org",
  "chainId": 98864,
  "networkId": 98864,
  "slip44": 1,
  "explorers": [],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111"
  },
  "status": "deprecated"
} satisfies Chain