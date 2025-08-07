// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6398 = {
  name: "Connext Sepolia",
  shortName: "connext-sepolia",
  chain: "Connext Sepolia",
  rpc: ["https://rpc.connext-sepolia.gelato.digital/"],
  faucets: [],
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "",
  chainId: 6398,
  networkId: 6398,
  explorers: [
    {
      name: "Connext Sepolia",
      url: "https://connext-sepolia.blockscout.com",
      standard: "none",
    },
  ],
} satisfies Chain
