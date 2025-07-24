/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_199 = {
  "name": "BitTorrent Chain Mainnet",
  "shortName": "BTT",
  "chain": "BTTC",
  "rpc": [
    "https://rpc.bittorrentchain.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BitTorrent",
    "symbol": "BTT",
    "decimals": 18
  },
  "infoURL": "https:/bt.io",
  "chainId": 199,
  "networkId": 199,
  "explorers": [
    {
      "name": "BitTorrent Chain Explorer",
      "url": "https://bttcscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain