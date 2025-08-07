// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_164 = {
  name: "Omni Omega Testnet",
  shortName: "omni_omega",
  chain: "Omni",
  icon: "omni",
  rpc: [
    "https://omega.omni.network",
    "wss://wss.omega.omni.network",
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
  chainId: 164,
  networkId: 164,
  slip44: 1,
  explorers: [
    {
      name: "Omni EVM and cross-chain Explorer",
      url: "https://omega.omniscan.network",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
