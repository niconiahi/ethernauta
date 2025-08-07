// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7244 = {
  name: "ZEUS Testnet",
  shortName: "ZEUS-Testnet",
  chain: "tZEUS",
  icon: "zeusicon",
  rpc: ["https://testnet-rpc.zeuschainscan.io"],
  faucets: ["https://faucet.zeuschainscan.io"],
  nativeCurrency: {
    name: "The ZEUS Token",
    symbol: "ZEUSX",
    decimals: 18,
  },
  infoURL: "https://testnet-explorer.zeuschainscan.io",
  chainId: 7244,
  networkId: 7244,
  explorers: [
    {
      name: "ZEUS Testnet Explorer",
      url: "https://testnet-explorer.zeuschainscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
