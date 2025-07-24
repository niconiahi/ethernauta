/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_808 = {
  "name": "Portal Fantasy Chain Test",
  "shortName": "PFTEST",
  "chain": "PF",
  "icon": "pf",
  "rpc": [
    "https://subnets.avax.network/portal-fantasy/testnet/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Portal Fantasy Token",
    "symbol": "PFT",
    "decimals": 18
  },
  "infoURL": "https://portalfantasy.io",
  "chainId": 808,
  "networkId": 808,
  "slip44": 1,
  "explorers": []
} satisfies Chain