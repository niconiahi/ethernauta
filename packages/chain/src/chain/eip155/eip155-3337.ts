// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3337 = {
  name: "EthStorage Devnet",
  shortName: "es-d",
  chain: "EthStorage",
  rpc: ["http://devnet.ethstorage.io:9540"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://ethstorage.io/",
  chainId: 3337,
  networkId: 3337,
  slip44: 1,
  status: "incubating",
} satisfies Chain
