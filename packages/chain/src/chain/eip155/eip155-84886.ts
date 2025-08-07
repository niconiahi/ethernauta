// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_84886 = {
  name: "Aerie Network",
  shortName: "Aerie",
  chain: "Aerie",
  icon: "aerie",
  rpc: ["https://mainnet.aerielab.io"],
  faucets: [],
  nativeCurrency: {
    name: "Aerie",
    symbol: "AER",
    decimals: 18,
  },
  infoURL: "https://aerielab.io/",
  chainId: 84886,
  networkId: 84886,
  explorers: [
    {
      name: "Aerie Explorer",
      url: "https://explorer.aerielab.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
