/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_512 = {
  "name": "Double-A Chain Mainnet",
  "shortName": "aac",
  "chain": "AAC",
  "icon": "aac",
  "rpc": [
    "https://rpc.acuteangle.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Acuteangle Native Token",
    "symbol": "AAC",
    "decimals": 18
  },
  "infoURL": "https://www.acuteangle.com/",
  "chainId": 512,
  "networkId": 512,
  "slip44": 1512,
  "explorers": [
    {
      "name": "aacscan",
      "url": "https://scan.acuteangle.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain