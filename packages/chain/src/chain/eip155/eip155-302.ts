// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_302 = {
  name: "ZKcandy Sepolia Testnet",
  shortName: "zkcandy-sepolia",
  chain: "ETH",
  icon: "zkcandy",
  rpc: ["https://sepolia.rpc.zkcandy.io"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://zkcandy.io/",
  chainId: 302,
  networkId: 302,
  explorers: [
    {
      name: "ZKcandy Block Explorer",
      url: "https://sepolia.explorer.zkcandy.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://sepolia.bridge.zkcandy.io/",
      },
    ],
  },
  redFlags: ["reusedChainId"],
} satisfies Chain
