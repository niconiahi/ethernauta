/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_13337 = {
  "name": "Beam Testnet",
  "shortName": "beam-testnet",
  "chain": "BEAM",
  "icon": "beam",
  "rpc": [
    "https://subnets.avax.network/beam/testnet/rpc",
    "wss://subnets.avax.network/beam/testnet/ws"
  ],
  "faucets": [
    "https://faucet.avax.network/?subnet=beam",
    "https://faucet.onbeam.com"
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Beam",
    "symbol": "BEAM",
    "decimals": 18
  },
  "infoURL": "https://www.onbeam.com",
  "chainId": 13337,
  "networkId": 13337,
  "slip44": 1,
  "explorers": [
    {
      "name": "Beam Explorer",
      "url": "https://subnets-test.avax.network/beam",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain