// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_81041 = {
  name: "Nordek Mainnet",
  shortName: "nordek",
  chain: "Nordek",
  icon: "nordek",
  rpc: ["https://mainnet-rpc.nordekscan.com"],
  faucets: [],
  nativeCurrency: {
    name: "NRK",
    symbol: "NRK",
    decimals: 18,
  },
  infoURL: "https://nordekscan.com",
  chainId: 81041,
  networkId: 81041,
  explorers: [
    {
      name: "nordek",
      url: "https://nordekscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
