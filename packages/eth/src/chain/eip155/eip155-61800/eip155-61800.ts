/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_61800 = {
  "name": "AxelChain Dev-Net",
  "shortName": "aium-dev",
  "chain": "AXEL",
  "icon": "axelium",
  "rpc": [
    "https://aium-rpc-dev.viacube.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Axelium",
    "symbol": "AIUM",
    "decimals": 18
  },
  "infoURL": "https://www.axel.org",
  "chainId": 61800,
  "networkId": 61800,
  "explorers": [
    {
      "name": "AxelChain Dev-Net Explorer",
      "url": "https://devexplorer2.viacube.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain