// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_21133 = {
  name: "All About Healthy",
  shortName: "aah",
  chain: "AAH",
  rpc: ["https://rpc.c4ex.net"],
  faucets: ["https://t.me/c4eiAirdrop"],
  nativeCurrency: {
    name: "AAH",
    symbol: "AAH",
    decimals: 18,
  },
  infoURL: "https://c4ex.net",
  chainId: 21133,
  networkId: 21133,
  explorers: [
    {
      name: "AAH Blockscout",
      url: "https://exp.c4ex.net",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
