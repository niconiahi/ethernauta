import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_30067: Chain = {
  name: "Piece testnet",
  shortName: "Piece",
  chain: "PieceNetwork",
  icon: "piecechain",
  rpc: [
    "https://testnet-rpc0.piecenetwork.com",
  ],
  faucets: [
    "https://piecenetwork.com/faucet",
  ],
  nativeCurrency: {
    name: "ECE",
    symbol: "ECE",
    decimals: 18,
  },
  infoURL: "https://piecenetwork.com",
  chainId: 30067,
  networkId: 30067,
  explorers: [
    {
      name: "Piece Scan",
      url: "https://testnet-scan.piecenetwork.com",
      standard: "EIP3091",
    },
  ],
}
