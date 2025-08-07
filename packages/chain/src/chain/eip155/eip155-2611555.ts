// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2611555 = {
  name: "DPU Chain",
  shortName: "DPU",
  chain: "DPU",
  rpc: ["https://sc-rpc.dpu.ac.th"],
  faucets: [],
  nativeCurrency: {
    name: "DGC",
    symbol: "DGC",
    decimals: 18,
  },
  infoURL: "",
  chainId: 2611555,
  networkId: 2611555,
} satisfies Chain
