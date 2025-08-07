// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_232 = {
  name: "Lens",
  shortName: "lens",
  title: "Lens mainnet",
  chain: "Lens",
  icon: "lens",
  rpc: ["https://rpc.lens.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "GHO",
    symbol: "GHO",
    decimals: 18,
  },
  infoURL: "https://lens.xyz",
  chainId: 232,
  networkId: 232,
  explorers: [
    {
      name: "Lens Block Explorer",
      url: "https://explorer.lens.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://app.across.to/bridge?destinationChainId=232",
      },
    ],
  },
} satisfies Chain
