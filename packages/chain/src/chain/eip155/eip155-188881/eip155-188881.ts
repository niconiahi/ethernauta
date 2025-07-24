/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_188881 = {
  "name": "Condor Test Network",
  "shortName": "condor",
  "chain": "CONDOR",
  "icon": "condor",
  "rpc": [
    "https://testnet.condor.systems/rpc"
  ],
  "faucets": [
    "https://faucet.condor.systems"
  ],
  "nativeCurrency": {
    "name": "Condor Native Token",
    "symbol": "CONDOR",
    "decimals": 18
  },
  "infoURL": "https://condor.systems",
  "chainId": 188881,
  "networkId": 188881,
  "slip44": 1,
  "explorers": [
    {
      "name": "CondorScan",
      "url": "https://explorer.condor.systems",
      "standard": "none"
    }
  ]
} satisfies Chain