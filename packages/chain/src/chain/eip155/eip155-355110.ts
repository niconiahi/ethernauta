// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_355110 = {
  name: "Bitfinity Network Mainnet",
  shortName: "bitfinity-mainnet",
  chain: "BTF",
  rpc: ["https://mainnet.bitfinity.network"],
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
    name: "Bitfinity Token",
    symbol: "BTF",
    decimals: 18,
  },
  infoURL: "https://bitfinity.network",
  chainId: 355110,
  networkId: 355110,
  explorers: [
    {
      name: "Bitfinity Mainnet Block Explorer",
      url: "https://explorer.mainnet.bitfinity.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
