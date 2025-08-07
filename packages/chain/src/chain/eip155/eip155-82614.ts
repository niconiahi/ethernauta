// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_82614 = {
  name: "VEMP Horizon",
  shortName: "vemp-horizon",
  chain: "vemp-horizon",
  icon: "vemp-horizon",
  rpc: ["https://vemp-horizon.calderachain.xyz/http"],
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
    name: "VEMP",
    symbol: "VEMP",
    decimals: 18,
  },
  infoURL: "https://www.vemp.xyz/",
  chainId: 82614,
  networkId: 82614,
  explorers: [
    {
      name: "VEMP Horizon Caldera Explorer",
      url: "https://vemp-horizon.calderaexplorer.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
