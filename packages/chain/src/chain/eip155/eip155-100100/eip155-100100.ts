/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_100100 = {
  "name": "Deprecated CHI",
  "shortName": "chi1",
  "chain": "CHI1",
  "icon": "gnosis",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Chiado xDAI",
    "symbol": "xDAI",
    "decimals": 18
  },
  "infoURL": "https://docs.gnosischain.com",
  "chainId": 100100,
  "networkId": 100100,
  "explorers": [],
  "status": "deprecated"
} satisfies Chain