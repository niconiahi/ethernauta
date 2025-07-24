/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2032 = {
  "name": "Catalyst",
  "shortName": "ncfg",
  "chain": "CFG",
  "rpc": [
    "wss://fullnode.catalyst.cntrfg.com"
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
    "name": "Catalyst CFG",
    "symbol": "NCFG",
    "decimals": 18
  },
  "infoURL": "https://centrifuge.io",
  "chainId": 2032,
  "networkId": 2032
} satisfies Chain