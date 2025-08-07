// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_93747 = {
  name: "StratoVM Testnet",
  shortName: "stratovm",
  chain: "StratoVM",
  rpc: ["https://rpc.stratovm.io"],
  faucets: [],
  nativeCurrency: {
    name: "SVM",
    symbol: "SVM",
    decimals: 18,
  },
  infoURL: "https://www.stratovm.io/",
  chainId: 93747,
  networkId: 93747,
  explorers: [
    {
      name: "StratoVM Block Explorer",
      url: "https://explorer.stratovm.io",
      standard: "none",
    },
  ],
} satisfies Chain
