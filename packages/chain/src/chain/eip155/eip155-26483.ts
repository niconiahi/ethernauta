/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_26483 = {
  "name": "DucatusX",
  "shortName": "ducatusx",
  "chain": "DUCX",
  "rpc": [
    "https://ducx-mainnet-node1.rocknblock.io",
    "https://ducx-mainnet-node2.rocknblock.io",
    "https://ducx-mainnet-node3.rocknblock.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DUCX",
    "symbol": "DUCX",
    "decimals": 18
  },
  "infoURL": "https://www.ducatuscoins.com/ducatusx",
  "chainId": 26483,
  "networkId": 26483,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.ducatusx.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain