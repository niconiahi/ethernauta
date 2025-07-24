/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_111222333444 = {
  "name": "Alphabet Mainnet",
  "shortName": "alphabet",
  "chain": "Alphabet Network",
  "icon": "alphabetnetwork",
  "rpc": [
    "https://londonpublic.alphabetnetwork.org",
    "wss://londonpublic.alphabetnetwork.org/ws/",
    "https://main-rpc.com",
    "wss://main-rpc.com/ws/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ALT",
    "symbol": "ALT",
    "decimals": 18
  },
  "infoURL": "https://alphabetnetwork.org",
  "chainId": 111222333444,
  "networkId": 111222333444,
  "explorers": [
    {
      "name": "Alphabet Explorer",
      "url": "https://scan.alphabetnetwork.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain