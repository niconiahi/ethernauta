/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_131313 = {
  "name": "Odyssey Chain (Testnet)",
  "shortName": "DIONE",
  "chain": "DIONE",
  "icon": "odyssey",
  "rpc": [
    "https://testnode.dioneprotocol.com/ext/bc/D/rpc"
  ],
  "faucets": [
    "https://faucet.dioneprotocol.com/"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "DIONE",
    "symbol": "DIONE",
    "decimals": 18
  },
  "infoURL": "https://www.dioneprotocol.com/",
  "chainId": 131313,
  "networkId": 131313
} satisfies Chain