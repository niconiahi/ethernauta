// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1100 = {
  name: "Dymension",
  shortName: "dymension",
  chain: "Dymension",
  icon: "dymension",
  rpc: [
    "https://dymension-evm.blockpi.network/v1/rpc/public",
    "https://dymension-evm-rpc.publicnode.com",
    "wss://dymension-evm-rpc.publicnode.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "DYM",
    symbol: "DYM",
    decimals: 18,
  },
  infoURL: "https://dymension.xyz",
  chainId: 1100,
  networkId: 1100,
  explorers: [
    {
      name: "dym.fyi",
      url: "https://dym.fyi",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
