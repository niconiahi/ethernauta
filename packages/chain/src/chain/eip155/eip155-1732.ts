// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1732 = {
  name: "Fuga Mainnet",
  shortName: "FUGA",
  chain: "Fuga",
  rpc: ["https://rpc.fuga.blue"],
  faucets: [],
  nativeCurrency: {
    name: "FUGA",
    symbol: "FUGA",
    decimals: 18,
  },
  infoURL: "https://fuga.one",
  chainId: 1732,
  networkId: 1732,
  slip44: 732,
  explorers: [],
  status: "incubating",
} satisfies Chain
