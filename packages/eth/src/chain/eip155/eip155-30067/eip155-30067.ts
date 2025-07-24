/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_30067 = {
  "name": "Piece testnet",
  "shortName": "Piece",
  "chain": "PieceNetwork",
  "icon": "piecechain",
  "rpc": [
    "https://testnet-rpc0.piecenetwork.com"
  ],
  "faucets": [
    "https://piecenetwork.com/faucet"
  ],
  "nativeCurrency": {
    "name": "ECE",
    "symbol": "ECE",
    "decimals": 18
  },
  "infoURL": "https://piecenetwork.com",
  "chainId": 30067,
  "networkId": 30067,
  "slip44": 1,
  "explorers": [
    {
      "name": "Piece Scan",
      "url": "https://testnet-scan.piecenetwork.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain