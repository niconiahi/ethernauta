/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_335 = {
  "name": "DFK Chain Test",
  "shortName": "DFKTEST",
  "chain": "DFK",
  "icon": "dfk",
  "rpc": [
    "https://subnets.avax.network/defi-kingdoms/dfk-chain-testnet/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Jewel",
    "symbol": "JEWEL",
    "decimals": 18
  },
  "infoURL": "https://defikingdoms.com",
  "chainId": 335,
  "networkId": 335,
  "slip44": 1,
  "explorers": [
    {
      "name": "ethernal",
      "url": "https://explorer-test.dfkchain.com",
      "standard": "none"
    }
  ]
} satisfies Chain