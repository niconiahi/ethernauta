// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_987 = {
  name: "BinaryChain Mainnet",
  shortName: "binary",
  chain: "BinaryChain",
  icon: "binary",
  rpc: ["https://rpc.binarychain.org"],
  faucets: [],
  nativeCurrency: {
    name: "BINARY",
    symbol: "BNRY",
    decimals: 18,
  },
  infoURL: "https://binarychain.org",
  chainId: 987,
  networkId: 987,
  explorers: [
    {
      name: "BinaryChain Explorer",
      url: "https://explorer.binarychain.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
