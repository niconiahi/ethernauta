/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_10067275 = {
  "name": "Plian Testnet Subchain 1",
  "shortName": "plian-testnet-l2",
  "chain": "Plian",
  "rpc": [
    "https://testnet.plian.io/child_test"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Plian Token",
    "symbol": "TPI",
    "decimals": 18
  },
  "infoURL": "https://plian.org/",
  "chainId": 10067275,
  "networkId": 10067275,
  "slip44": 1,
  "explorers": [
    {
      "name": "piscan",
      "url": "https://testnet.plian.org/child_test",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-16658437"
  }
} satisfies Chain