// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3102 = {
  name: "Vulture EVM Beta",
  shortName: "VFI",
  chain: "VFIEVMCC",
  rpc: [
    "https://fraa-dancebox-3050-rpc.a.dancebox.tanssi.network",
    "wss://fraa-dancebox-3050-rpc.a.dancebox.tanssi.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "VFI",
    symbol: "VFI",
    decimals: 18,
  },
  infoURL: "https://vulture.finance",
  chainId: 3102,
  networkId: 3102,
  explorers: [],
} satisfies Chain
