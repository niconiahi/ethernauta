/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_13371 = {
  "name": "Immutable zkEVM",
  "shortName": "imx",
  "chain": "Immutable zkEVM",
  "icon": "immutable",
  "rpc": [
    "https://rpc.immutable.com"
  ],
  "faucets": [
    "https://docs.immutable.com/docs/zkEVM/guides/faucet"
  ],
  "nativeCurrency": {
    "name": "IMX",
    "symbol": "IMX",
    "decimals": 18
  },
  "infoURL": "https://www.immutable.com",
  "chainId": 13371,
  "networkId": 13371,
  "explorers": [
    {
      "name": "Immutable explorer",
      "url": "https://explorer.immutable.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain