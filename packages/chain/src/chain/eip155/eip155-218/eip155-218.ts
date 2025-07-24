/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_218 = {
  "name": "SoterOne Mainnet old",
  "shortName": "SO1-old",
  "chain": "SOTER",
  "rpc": [
    "https://rpc.soter.one"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SoterOne Mainnet Ether",
    "symbol": "SOTER",
    "decimals": 18
  },
  "infoURL": "https://www.soterone.com",
  "chainId": 218,
  "networkId": 218,
  "status": "deprecated"
} satisfies Chain