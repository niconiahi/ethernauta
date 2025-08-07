// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_16600 = {
  name: "0G-Newton-Testnet",
  shortName: "0gai-testnet",
  chain: "0G-Testnet",
  icon: "0gai",
  rpc: ["https://evmrpc-testnet.0g.ai"],
  faucets: ["https://faucet.0g.ai"],
  nativeCurrency: {
    name: "A0GI",
    symbol: "A0GI",
    decimals: 18,
  },
  infoURL: "https://0g.ai",
  chainId: 16600,
  networkId: 16600,
  explorers: [
    {
      name: "0G BlockChain Explorer",
      url: "https://chainscan-newton.0g.ai",
      standard: "none",
    },
  ],
} satisfies Chain
