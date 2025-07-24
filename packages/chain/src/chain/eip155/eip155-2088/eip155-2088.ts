/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2088 = {
  "name": "Altair",
  "shortName": "air",
  "chain": "AIR",
  "rpc": [
    "wss://fullnode.altair.centrifuge.io"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Altair",
    "symbol": "AIR",
    "decimals": 18
  },
  "infoURL": "https://centrifuge.io",
  "chainId": 2088,
  "networkId": 2088
} satisfies Chain