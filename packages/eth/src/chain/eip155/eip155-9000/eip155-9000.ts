/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_9000 = {
  "name": "Evmos Testnet",
  "shortName": "evmos-testnet",
  "chain": "Evmos",
  "icon": "evmos",
  "rpc": [
    "https://evmos-testnet.lava.build",
    "https://eth.bd.evmos.dev:8545"
  ],
  "faucets": [
    "https://faucet.evmos.dev"
  ],
  "nativeCurrency": {
    "name": "test-Evmos",
    "symbol": "tEVMOS",
    "decimals": 18
  },
  "infoURL": "https://evmos.org",
  "chainId": 9000,
  "networkId": 9000,
  "slip44": 1,
  "explorers": [
    {
      "name": "Evmos Explorer (Escan)",
      "url": "https://testnet.escan.live",
      "standard": "none"
    }
  ]
} satisfies Chain