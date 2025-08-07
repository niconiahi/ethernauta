// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_808080 = {
  name: "BIZ Smart Chain Testnet",
  shortName: "bizt-testnet",
  chain: "BIZT Testnet",
  icon: "biz",
  rpc: ["https://rpc-testnet.bizex.io/"],
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
    name: "tBIZT",
    symbol: "tBIZT",
    decimals: 18,
  },
  infoURL: "https://www.biztoken.io/",
  chainId: 808080,
  networkId: 808080,
  slip44: 1,
  explorers: [
    {
      name: "BIZ Smart Chain Testnet Explorer",
      url: "https://testnet.btscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
