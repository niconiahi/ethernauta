import type { Chain } from "../shared"

export const eip155_2110 = {
  name: "Parallax",
  shortName: "parallax",
  chain: "PARALLAX",
  icon: "parallax",
  rpc: ["https://rpc.parallaxprotocol.org"],
  faucets: ["https://faucet.parallaxprotocol.org"],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Parallax",
    symbol: "LAX",
    decimals: 18,
  },
  infoURL: "https://parallaxprotocol.org",
  chainId: 2110,
  networkId: 2110,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.parallaxprotocol.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
