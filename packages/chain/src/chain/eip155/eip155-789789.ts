// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_789789 = {
  name: "Emeraldz",
  shortName: "emed",
  chain: "EMED",
  rpc: ["https://public.0xrpc.com/789789"],
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
    name: "EMERALDZ",
    symbol: "EMED",
    decimals: 18,
  },
  infoURL: "https://emeraldzscan.com",
  chainId: 789789,
  networkId: 789789,
  explorers: [
    {
      name: "Emeraldz Explorer",
      url: "https://emeraldzscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
