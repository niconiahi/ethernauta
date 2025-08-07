// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4048 = {
  name: "GANchain L1",
  shortName: "GANchain",
  chain: "GAN",
  icon: "gpu",
  rpc: ["https://rpc.gpu.net"],
  faucets: [],
  nativeCurrency: {
    name: "GPUnet",
    symbol: "GPU",
    decimals: 18,
  },
  infoURL: "https://docs.gpu.net/",
  chainId: 4048,
  networkId: 4048,
  explorers: [
    {
      name: "ganscan",
      url: "https://ganscan.gpu.net",
      standard: "none",
    },
  ],
} satisfies Chain
