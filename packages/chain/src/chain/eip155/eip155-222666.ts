// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_222666 = {
  name: "DeepL Testnet",
  shortName: "tdeepl",
  chain: "DEEPL",
  icon: "deepl",
  rpc: ["https://testnet.deeplnetwork.org"],
  faucets: ["https://faucet.deeplnetwork.org"],
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
  chainId: 222666,
  networkId: 222666,
  explorers: [
    {
      name: "DeepL Testnet Explorer",
      url: "https://testnet-scan.deeplnetwork.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
