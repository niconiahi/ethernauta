/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_68 = {
  "name": "SoterOne Mainnet",
  "shortName": "SO1",
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
  "chainId": 68,
  "networkId": 68
} satisfies Chain