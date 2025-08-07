// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_80008 = {
  name: "Polynomial Sepolia",
  shortName: "polynomialSepolia",
  chain: "polynomialSepolia",
  icon: "polynomialSepolia",
  rpc: ["https://rpc.sepolia.polynomial.fi"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://polynomial.fi",
  chainId: 80008,
  networkId: 80008,
  explorers: [
    {
      name: "Polynomial Sepolia Explorer",
      url: "https://sepolia.polynomialscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
