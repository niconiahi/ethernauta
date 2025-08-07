/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_191 = {
  "name": "FileFileGo",
  "shortName": "ffg",
  "chain": "FFG",
  "icon": "ffgIcon",
  "rpc": [
    "https://rpc.filefilego.com/rpc"
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
    "name": "FFG",
    "symbol": "FFG",
    "decimals": 18
  },
  "infoURL": "https://filefilego.com",
  "chainId": 191,
  "networkId": 191
} satisfies Chain