/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1029 = {
  "name": "BitTorrent Chain Donau",
  "shortName": "tBTT",
  "chain": "BTTC",
  "icon": "bttc",
  "rpc": [
    "https://pre-rpc.bt.io"
  ],
  "faucets": [
    "https://testfaucet.bt.io"
  ],
  "nativeCurrency": {
    "name": "BitTorrent",
    "symbol": "BTT",
    "decimals": 18
  },
  "infoURL": "https://bt.io",
  "chainId": 1029,
  "networkId": 1029,
  "slip44": 1,
  "explorers": [
    {
      "name": "BitTorrent Chain Donau Explorer",
      "url": "https://testnet.bttcscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain