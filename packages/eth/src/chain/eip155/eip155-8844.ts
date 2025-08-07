/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_8844 = {
  "name": "Hydra Chain Testnet",
  "shortName": "THYDRA",
  "chain": "HYDRA",
  "icon": "hydra",
  "rpc": [
    "https://rpc-testnet.hydrachain.org"
  ],
  "faucets": [
    "https://testnetapp.hydrachain.org/faucet"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "tHydra",
    "symbol": "tHYDRA",
    "decimals": 18
  },
  "infoURL": "https://hydrachain.org",
  "chainId": 8844,
  "networkId": 8844,
  "explorers": [
    {
      "name": "Hydra Chain Testnet explorer",
      "url": "https://hydragon.hydrachain.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain