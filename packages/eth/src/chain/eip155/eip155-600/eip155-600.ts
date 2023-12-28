/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_600 = {
  "name": "Meshnyan testnet",
  "shortName": "mesh-chain-testnet",
  "chain": "MeshTestChain",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Meshnyan Testnet Native Token",
    "symbol": "MESHT",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 600,
  "networkId": 600,
  "slip44": 1
} satisfies Chain