// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_245022934 = {
  name: "Neon EVM Mainnet",
  shortName: "neonevm-mainnet",
  chain: "Solana",
  icon: "neon",
  rpc: [
    "https://neon-proxy-mainnet.solana.p2p.org",
    "https://neon-evm.drpc.org",
    "wss://neon-evm.drpc.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Neon",
    symbol: "NEON",
    decimals: 18,
  },
  infoURL: "https://neonevm.org",
  chainId: 245022934,
  networkId: 245022934,
  explorers: [
    {
      name: "neonscan",
      url: "https://neonscan.org",
      standard: "EIP3091",
    },
    {
      name: "native",
      url: "https://neon.blockscout.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
