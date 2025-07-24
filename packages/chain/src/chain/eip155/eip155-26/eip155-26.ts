/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_26 = {
  "name": "Genesis L1 testnet",
  "shortName": "L1test",
  "chain": "genesis",
  "rpc": [
    "https://testrpc.genesisl1.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "L1 testcoin",
    "symbol": "L1test",
    "decimals": 18
  },
  "infoURL": "https://www.genesisl1.com",
  "chainId": 26,
  "networkId": 26,
  "slip44": 1,
  "explorers": [
    {
      "name": "Genesis L1 testnet explorer",
      "url": "https://testnet.genesisl1.org",
      "standard": "none"
    }
  ]
} satisfies Chain