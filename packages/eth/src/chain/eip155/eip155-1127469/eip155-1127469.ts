/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1127469 = {
  "name": "Tiltyard Subnet",
  "shortName": "tiltyard",
  "chain": "TILTYARD",
  "rpc": [
    "https://subnets.avax.network/tiltyard/testnet/rpc"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Tiltyard Token",
    "symbol": "TILTG",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 1127469,
  "networkId": 1127469,
  "explorers": [
    {
      "name": "TILTYARD Explorer",
      "url": "http://testnet-explorer.tiltyard.gg",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain