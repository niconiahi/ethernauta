/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_6122 = {
  "name": "Tea Mainnet",
  "shortName": "tea",
  "chain": "TEA",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tea",
    "symbol": "TEA",
    "decimals": 18
  },
  "infoURL": "https://tea.xyz",
  "chainId": 6122,
  "networkId": 6122,
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  },
  "status": "incubating"
} satisfies Chain