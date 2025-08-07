/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_555666 = {
  "name": "Eclipse Testnet",
  "shortName": "eclipset",
  "chain": "ECLIPSE",
  "rpc": [
    "https://subnets.avax.network/eclipsecha/testnet/rpc"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Eclipse",
    "symbol": "ECLPS",
    "decimals": 18
  },
  "infoURL": "http://eclipsenet.io",
  "chainId": 555666,
  "networkId": 555666,
  "explorers": [
    {
      "name": "ECLIPSE Explorer",
      "url": "https://subnets-test.avax.network/eclipsecha",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain