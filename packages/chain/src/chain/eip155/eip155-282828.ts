// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_282828 = {
  name: "Zillion Sepolia Testnet",
  shortName: "zillsep",
  chain: "ETH",
  icon: "zillion",
  rpc: ["https://sepolia.zillnet.io/rpc"],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://zillnet.io",
  chainId: 282828,
  networkId: 282828,
  slip44: 1,
  explorers: [
    {
      name: "zillscout",
      url: "https://sepolia.zillnet.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
  },
  status: "active",
} satisfies Chain
