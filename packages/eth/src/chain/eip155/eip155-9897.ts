/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9897 = {
  "name": "arena-z-testnet-deprecated",
  "shortName": "arena-z-testnet-deprecated",
  "title": "Arena-Z-Testnet-deprecated",
  "chain": "arena-z-testnet-deprecated",
  "icon": "arena-z",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://raas.gelato.network/rollups/details/public/arena-z-testnet",
  "chainId": 9897,
  "networkId": 9897,
  "slip44": 60,
  "explorers": [],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": []
  },
  "status": "deprecated"
} satisfies Chain