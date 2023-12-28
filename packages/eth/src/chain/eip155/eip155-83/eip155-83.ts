/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_83 = {
  "name": "Meter Testnet",
  "shortName": "MeterTest",
  "chain": "METER Testnet",
  "rpc": [
    "https://rpctest.meter.io"
  ],
  "faucets": [
    "https://faucet-warringstakes.meter.io"
  ],
  "nativeCurrency": {
    "name": "Meter",
    "symbol": "MTR",
    "decimals": 18
  },
  "infoURL": "https://www.meter.io",
  "chainId": 83,
  "networkId": 83,
  "slip44": 1,
  "explorers": [
    {
      "name": "Meter Testnet Scan",
      "url": "https://scan-warringstakes.meter.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain