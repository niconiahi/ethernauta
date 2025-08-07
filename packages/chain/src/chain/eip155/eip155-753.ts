// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_753 = {
  name: "Rivalz",
  shortName: "rivalz",
  chain: "rivalz",
  icon: "rivalz",
  rpc: ["https://rivalz.calderachain.xyz/http"],
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
  infoURL: "https://rivalz.hub.caldera.xyz",
  chainId: 753,
  networkId: 753,
  explorers: [
    {
      name: "Rivalz Caldera Explorer",
      url: "https://rivalz.calderaexplorer.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
