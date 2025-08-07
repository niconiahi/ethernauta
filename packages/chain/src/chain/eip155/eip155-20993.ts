// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_20993 = {
  name: "Fluent Developer Preview",
  shortName: "fluent-dev-net",
  chain: "Fluent",
  rpc: ["https://rpc.dev.gblend.xyz"],
  faucets: ["https://faucet.dev.gblend.xyz"],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://fluent.xyz",
  chainId: 20993,
  networkId: 20993,
  explorers: [
    {
      name: "Fluent Blockscout Explorer",
      url: "https://blockscout.dev.gblend.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
