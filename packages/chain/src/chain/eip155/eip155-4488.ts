// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4488 = {
  name: "Hydra Chain",
  shortName: "HYDRA",
  chain: "HYDRA",
  icon: "hydra",
  rpc: ["https://rpc-mainnet.hydrachain.org"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Hydra",
    symbol: "HYDRA",
    decimals: 18,
  },
  infoURL: "https://hydrachain.org",
  chainId: 4488,
  networkId: 4488,
  explorers: [
    {
      name: "Hydra Chain Mainnet explorer",
      url: "https://skynet.hydrachain.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
