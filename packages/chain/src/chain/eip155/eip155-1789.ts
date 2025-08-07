// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1789 = {
  name: "ZKBase Sepolia Testnet",
  shortName: "zkbase-sepolia",
  chain: "ETH",
  icon: "zkbase",
  rpc: ["https://sepolia-rpc.zkbase.app"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://zkbase.org/",
  chainId: 1789,
  networkId: 1789,
  slip44: 1,
  explorers: [
    {
      name: "ZKbase Block Explorer",
      url: "https://sepolia-explorer.zkbase.app",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://portal.zkbase.app/",
      },
    ],
  },
  redFlags: ["reusedChainId"],
} satisfies Chain
