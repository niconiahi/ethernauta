// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7210 = {
  name: "Nibiru testnet-1",
  shortName: "nibiru-testnet-1",
  chain: "Nibiru",
  icon: "nibiru",
  rpc: ["https://evm-rpc.testnet-1.nibiru.fi"],
  faucets: [],
  nativeCurrency: {
    name: "NIBI",
    symbol: "NIBI",
    decimals: 18,
  },
  infoURL: "https://nibiru.fi",
  chainId: 7210,
  networkId: 7210,
  explorers: [],
  status: "deprecated",
} satisfies Chain
