// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7222 = {
  name: "Nibiru devnet-3",
  shortName: "nibiru-devnet-3",
  chain: "Nibiru",
  icon: "nibiru",
  rpc: ["https://evm-rpc.devnet-3.nibiru.fi"],
  faucets: [],
  nativeCurrency: {
    name: "NIBI",
    symbol: "NIBI",
    decimals: 18,
  },
  infoURL: "https://nibiru.fi",
  chainId: 7222,
  networkId: 7222,
  explorers: [],
  status: "deprecated",
} satisfies Chain
