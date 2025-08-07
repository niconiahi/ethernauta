// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_998 = {
  name: "Hyperliquid EVM Testnet",
  shortName: "hype-evm-testnet",
  chain: "HYPE",
  rpc: ["https://api.hyperliquid-testnet.xyz/evm"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "HYPE",
    symbol: "HYPE",
    decimals: 18,
  },
  infoURL: "https://hyperfoundation.org/",
  chainId: 998,
  networkId: 998,
  explorers: [],
  redFlags: ["reusedChainId"],
} satisfies Chain
