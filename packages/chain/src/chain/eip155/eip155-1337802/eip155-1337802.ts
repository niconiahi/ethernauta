/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1337802 = {
  "name": "Kiln",
  "shortName": "kiln",
  "chain": "ETH",
  "icon": "ethereum",
  "rpc": [
    "https://rpc.kiln.themerge.dev"
  ],
  "faucets": [
    "https://faucet.kiln.themerge.dev",
    "https://kiln-faucet.pk910.de",
    "https://kilnfaucet.com"
  ],
  "nativeCurrency": {
    "name": "Testnet ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://kiln.themerge.dev/",
  "chainId": 1337802,
  "networkId": 1337802,
  "explorers": [
    {
      "name": "Kiln Explorer",
      "url": "https://explorer.kiln.themerge.dev",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain