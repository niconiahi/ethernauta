// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_223344 = {
  name: "B20 Testnet",
  shortName: "B20",
  chain: "B20",
  icon: "b20",
  rpc: ["https://rpc.beonescan.com"],
  faucets: ["https://faucet.beonechain.com/"],
  nativeCurrency: {
    name: "B20",
    symbol: "TBOC",
    decimals: 18,
  },
  infoURL: "https://rpc.beonescan.com",
  chainId: 223344,
  networkId: 223344,
  explorers: [
    {
      name: "beonescan",
      url: "https://beonescan.com",
      standard: "none",
    },
  ],
} satisfies Chain
