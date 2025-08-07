// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2522 = {
  name: "Fraxtal Testnet",
  shortName: "fraxtal-testnet",
  chain: "FRAX",
  icon: "fraxtal",
  rpc: [
    "https://rpc.testnet.frax.com",
    "https://fraxtal-holesky-rpc.publicnode.com",
    "wss://fraxtal-holesky-rpc.publicnode.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Frax",
    symbol: "FRAX",
    decimals: 18,
  },
  infoURL: "https://testnet.frax.com",
  chainId: 2522,
  networkId: 2522,
  slip44: 1,
  explorers: [
    {
      name: "fraxscan",
      url: "https://holesky.fraxscan.com",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
