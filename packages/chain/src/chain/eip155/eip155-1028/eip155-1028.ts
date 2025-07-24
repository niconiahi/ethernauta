/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1028 = {
  "name": "BitTorrent Chain Testnet",
  "shortName": "tbtt",
  "chain": "BTTC",
  "rpc": [
    "https://testrpc.bittorrentchain.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BitTorrent",
    "symbol": "BTT",
    "decimals": 18
  },
  "infoURL": "https://bittorrentchain.io/",
  "chainId": 1028,
  "networkId": 1028,
  "slip44": 1,
  "explorers": [
    {
      "name": "testbttcscan",
      "url": "https://testscan.bittorrentchain.io",
      "standard": "none"
    }
  ]
} satisfies Chain