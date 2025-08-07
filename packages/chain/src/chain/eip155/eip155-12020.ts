// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_12020 = {
  name: "Aternos",
  shortName: "ATR",
  chain: "Aternos",
  icon: "aternos",
  rpc: ["https://rpc.aternoschain.com"],
  faucets: ["https://faucet.aternoschain.com"],
  nativeCurrency: {
    name: "Aternos",
    symbol: "ATR",
    decimals: 18,
  },
  infoURL: "https://aternoschain.com",
  chainId: 12020,
  networkId: 12020,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.aternoschain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
