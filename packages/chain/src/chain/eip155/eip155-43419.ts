/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_43419 = {
  "name": "GUNZ",
  "shortName": "gunz-mainnet",
  "chain": "GUNZ",
  "icon": "gunz",
  "rpc": [
    "https://rpc.gunzchain.io/ext/bc/2M47TxWHGnhNtq6pM5zPXdATBtuqubxn5EPFgFmEawCQr9WFML/rpc"
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
    "name": "GUN",
    "symbol": "GUN",
    "decimals": 18
  },
  "infoURL": "https://gunbygunz.com",
  "chainId": 43419,
  "networkId": 43419,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://gunzscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain