/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_67390 = {
  "name": "SiriusNet",
  "shortName": "mcl",
  "chain": "SIN",
  "rpc": [
    "https://u0tnafcv6j:o2T045sxuCNXL878RDQLp5__Zj-es2cvdjtgkl4etn0@u0v7kwtvtg-u0wj114sve-rpc.us0-aws.kaleido.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MCD",
    "symbol": "MCD",
    "decimals": 18
  },
  "infoURL": "https://macaucasinolisboa.xyz",
  "chainId": 67390,
  "networkId": 67390,
  "explorers": [
    {
      "name": "siriusnetscan",
      "url": "https://siriusnet.tryethernal.com",
      "standard": "EIP3091"
    }
  ],
  "status": "deprecated"
} satisfies Chain