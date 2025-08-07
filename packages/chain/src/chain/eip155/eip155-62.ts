// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_62 = {
  name: "Morden Testnet",
  shortName: "tetc",
  title: "Ethereum Classic Morden Testnet",
  chain: "ETC",
  icon: "ethereumclassictestnet",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Morden Ether",
    symbol: "TETC",
    decimals: 18,
  },
  infoURL:
    "https://ethereumclassic.org/development/testnets",
  chainId: 62,
  networkId: 2,
  slip44: 1,
  status: "deprecated",
} satisfies Chain
