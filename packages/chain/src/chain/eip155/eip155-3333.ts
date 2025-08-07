// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3333 = {
  name: "EthStorage Testnet",
  shortName: "es-t",
  chain: "EthStorage",
  rpc: ["http://testnet.ethstorage.io:9540"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://ethstorage.io/",
  chainId: 3333,
  networkId: 3333,
  slip44: 1,
} satisfies Chain
