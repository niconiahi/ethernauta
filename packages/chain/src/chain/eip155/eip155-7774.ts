// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7774 = {
  name: "GDCC MAINNET",
  shortName: "GdccMainnet",
  chain: "GDCC",
  icon: "gdcc",
  rpc: ["https://mainnet-rpc-1.gdccscan.io"],
  faucets: [],
  nativeCurrency: {
    name: "GDCC",
    symbol: "GDCC",
    decimals: 18,
  },
  infoURL: "https://gdcchain.com",
  chainId: 7774,
  networkId: 7774,
  explorers: [
    {
      name: "GDCC",
      url: "https://gdccscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
