// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5080 = {
  name: "Pione Zero",
  shortName: "pzo",
  chain: "PZO",
  icon: "pzo",
  rpc: ["https://rpc.zeroscan.org"],
  faucets: ["https://dex.pionechain.com/testnet/faucet/"],
  nativeCurrency: {
    name: "Pione Zero",
    symbol: "PZO",
    decimals: 18,
  },
  infoURL: "https://pionechain.com",
  chainId: 5080,
  networkId: 5080,
  explorers: [
    {
      name: "Pione Zero Explorer",
      url: "https://zeroscan.org",
      standard: "EIP3091",
    },
    {
      name: "Pione Zero Explorer",
      url: "https://zero.pionescan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
