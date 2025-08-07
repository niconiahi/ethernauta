// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6868 = {
  name: "Pools Mainnet",
  shortName: "POOLS",
  chain: "Pools",
  icon: "POOLS",
  rpc: ["https://rpc.poolsmobility.com"],
  faucets: [],
  nativeCurrency: {
    name: "POOLS Native Token",
    symbol: "POOLS",
    decimals: 18,
  },
  infoURL: "https://www.poolschain.org",
  chainId: 6868,
  networkId: 6868,
  slip44: 6868,
  explorers: [
    {
      name: "poolsscan",
      url: "https://scan.poolsmobility.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
