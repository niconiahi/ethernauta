// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_166 = {
  name: "Omni",
  shortName: "omni",
  chain: "Omni",
  icon: "omni",
  rpc: [
    "https://mainnet.omni.network",
    "wss://wss.mainnet.omni.network",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Omni",
    symbol: "OMNI",
    decimals: 18,
  },
  infoURL: "https://docs.omni.network",
  chainId: 166,
  networkId: 166,
  slip44: 1,
  explorers: [
    {
      name: "Omni EVM and cross-chain Explorer",
      url: "https://omniscan.network",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
