// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_42793 = {
  name: "Etherlink Mainnet",
  shortName: "etlk",
  chain: "Etherlink",
  icon: "etherlink",
  rpc: ["https://node.mainnet.etherlink.com"],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "tez",
    symbol: "XTZ",
    decimals: 18,
  },
  infoURL: "https://etherlink.com",
  chainId: 42793,
  networkId: 42793,
  explorers: [
    {
      name: "Etherlink Explorer",
      url: "https://explorer.etherlink.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
