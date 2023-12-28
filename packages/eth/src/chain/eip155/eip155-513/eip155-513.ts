/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_513 = {
  "name": "Double-A Chain Testnet",
  "shortName": "aact",
  "chain": "AAC",
  "icon": "aac",
  "rpc": [
    "https://rpc-testnet.acuteangle.com"
  ],
  "faucets": [
    "https://scan-testnet.acuteangle.com/faucet"
  ],
  "nativeCurrency": {
    "name": "Acuteangle Native Token",
    "symbol": "AAC",
    "decimals": 18
  },
  "infoURL": "https://www.acuteangle.com/",
  "chainId": 513,
  "networkId": 513,
  "slip44": 1,
  "explorers": [
    {
      "name": "aacscan-testnet",
      "url": "https://scan-testnet.acuteangle.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain