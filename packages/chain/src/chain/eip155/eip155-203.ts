// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_203 = {
  name: "WowChain Mainnet",
  shortName: "wow",
  title: "WowChain Mainnet",
  chain: "WowChain",
  icon: "wowchain",
  rpc: ["https://rpc.wowchain.io"],
  faucets: [],
  nativeCurrency: {
    name: "Dogecoin",
    symbol: "DOGE",
    decimals: 18,
  },
  infoURL: "https://wowchain.io",
  chainId: 203,
  networkId: 203,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.wowchain.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
