// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6911 = {
  name: "Nibiru testnet-2",
  shortName: "nibiru-testnet-2",
  chain: "Nibiru",
  icon: "nibiru",
  rpc: ["https://evm-rpc.testnet-2.nibiru.fi"],
  faucets: [],
  nativeCurrency: {
    name: "NIBI",
    symbol: "NIBI",
    decimals: 18,
  },
  infoURL: "https://nibiru.fi",
  chainId: 6911,
  networkId: 6911,
  explorers: [],
} satisfies Chain
