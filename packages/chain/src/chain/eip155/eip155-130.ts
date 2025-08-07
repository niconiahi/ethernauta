// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_130 = {
  name: "Unichain",
  shortName: "unichain",
  chain: "ETH",
  icon: "unichain",
  rpc: [
    "https://mainnet.unichain.org",
    "https://unichain-rpc.publicnode.com",
    "wss://unichain-rpc.publicnode.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://unichain.org",
  chainId: 130,
  networkId: 130,
  explorers: [
    {
      name: "Unichain Mainnet Explorer",
      url: "https://uniscan.xyz",
      standard: "EIP3091",
    },
    {
      name: "Unichain Mainnet Explorer",
      url: "https://unichain.blockscout.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
