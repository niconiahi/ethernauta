// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_169 = {
  name: "Manta Pacific Mainnet",
  shortName: "manta",
  chain: "Manta Pacific",
  icon: "manta",
  rpc: [
    "https://pacific-rpc.manta.network/http",
    "https://manta-pacific.drpc.org",
    "wss://manta-pacific.drpc.org",
  ],
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
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://pacific-info.manta.network",
  chainId: 169,
  networkId: 169,
  explorers: [
    {
      name: "manta-pacific Explorer",
      url: "https://pacific-explorer.manta.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
