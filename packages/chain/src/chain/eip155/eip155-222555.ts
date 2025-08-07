// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_222555 = {
  name: "DeepL Mainnet",
  shortName: "deepl",
  chain: "DEEPL",
  icon: "deepl",
  rpc: ["https://rpc.deeplnetwork.org"],
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
    name: "DeepL",
    symbol: "DEEPL",
    decimals: 18,
  },
  infoURL: "https://deeplnetwork.org",
  chainId: 222555,
  networkId: 222555,
  explorers: [
    {
      name: "DeepL Mainnet Explorer",
      url: "https://scan.deeplnetwork.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
