/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_18159 = {
  "name": "Proof Of Memes",
  "shortName": "pom",
  "title": "Proof Of Memes Mainnet",
  "chain": "POM",
  "icon": "pom",
  "rpc": [
    "https://mainnet-rpc.memescan.io",
    "https://mainnet-rpc2.memescan.io",
    "https://mainnet-rpc3.memescan.io",
    "https://mainnet-rpc4.memescan.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Proof Of Memes",
    "symbol": "POM",
    "decimals": 18
  },
  "infoURL": "https://proofofmemes.org",
  "chainId": 18159,
  "networkId": 18159,
  "explorers": [
    {
      "name": "explorer-proofofmemes",
      "url": "https://memescan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain