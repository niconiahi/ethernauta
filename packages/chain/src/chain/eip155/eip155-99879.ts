// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_99879 = {
  name: "Edge Matrix Chain Sepolia",
  shortName: "EMCSepolia",
  chain: "EMC Sepolia",
  icon: "emctest",
  rpc: ["https://rpc1-sepolia.emc.network"],
  faucets: [],
  nativeCurrency: {
    name: "Edge Matrix Chain Token",
    symbol: "EMC",
    decimals: 18,
  },
  infoURL: "",
  chainId: 99879,
  networkId: 99879,
  explorers: [
    {
      name: "blockscout",
      url: "https://sepolia.emcscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
