// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_50001 = {
  name: "Liveplex OracleEVM",
  shortName: "LOE",
  chain: "Liveplex OracleEVM Network",
  rpc: ["https://rpc.oracle.liveplex.io"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "",
  chainId: 50001,
  networkId: 50001,
  explorers: [],
} satisfies Chain
