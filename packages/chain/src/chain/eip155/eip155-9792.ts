// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9792 = {
  name: "Carbon EVM Testnet",
  shortName: "carbon-testnet",
  chain: "Carbon",
  icon: "carbon",
  rpc: ["https://test-evm-api.carbon.network/"],
  faucets: [],
  nativeCurrency: {
    name: "swth",
    symbol: "SWTH",
    decimals: 18,
  },
  infoURL: "https://carbon.network/",
  chainId: 9792,
  networkId: 9792,
  slip44: 1,
  explorers: [],
} satisfies Chain
