// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_24076 = {
  name: "KYMTC Testnet",
  shortName: "tKYMTC",
  chain: "KYMTC",
  icon: "kymtc",
  rpc: ["https://testnet-rpc.kymaticscan.online"],
  faucets: ["https://faucet.kymaticscan.online"],
  nativeCurrency: {
    name: "KYMTC",
    symbol: "KYMTC",
    decimals: 18,
  },
  infoURL: "https://testnet-explorer.kymaticscan.online",
  chainId: 24076,
  networkId: 24076,
  explorers: [
    {
      name: "KYMTC Testnet Explorer",
      url: "https://testnet-explorer.kymaticscan.online",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
