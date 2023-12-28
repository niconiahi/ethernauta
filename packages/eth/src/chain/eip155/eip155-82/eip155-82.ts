/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_82 = {
  "name": "Meter Mainnet",
  "shortName": "Meter",
  "chain": "METER",
  "rpc": [
    "https://rpc.meter.io"
  ],
  "faucets": [
    "https://faucet.meter.io"
  ],
  "nativeCurrency": {
    "name": "Meter",
    "symbol": "MTR",
    "decimals": 18
  },
  "infoURL": "https://www.meter.io",
  "chainId": 82,
  "networkId": 82,
  "explorers": [
    {
      "name": "Meter Mainnet Scan",
      "url": "https://scan.meter.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain