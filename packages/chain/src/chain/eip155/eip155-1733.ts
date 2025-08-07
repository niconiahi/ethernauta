// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1733 = {
  name: "Fuga Testnet",
  shortName: "FUGA_T",
  chain: "Fuga",
  rpc: ["https://rpc-testnet.fuga.blue"],
  faucets: [],
  nativeCurrency: {
    name: "FUGA",
    symbol: "FUGA",
    decimals: 18,
  },
  infoURL: "https://fuga.one",
  chainId: 1733,
  networkId: 1733,
  slip44: 1,
  explorers: [],
  status: "incubating",
} satisfies Chain
