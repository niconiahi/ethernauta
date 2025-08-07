/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_55551 = {
  "name": "Photon Aurora Testnet",
  "shortName": "pton",
  "chain": "Photon",
  "rpc": [
    "https://rpc-test2.photonchain.io"
  ],
  "faucets": [
    "https://photonchain.io/testnet2"
  ],
  "nativeCurrency": {
    "name": "Photon",
    "symbol": "PTON",
    "decimals": 18
  },
  "infoURL": "https://photonchain.io",
  "chainId": 55551,
  "networkId": 55551,
  "explorers": [
    {
      "name": "photon_testnet2_explorer",
      "url": "https://testnet2.photonchain.io",
      "standard": "none"
    }
  ]
} satisfies Chain