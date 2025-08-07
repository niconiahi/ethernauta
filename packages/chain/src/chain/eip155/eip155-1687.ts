// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1687 = {
  name: "Mint Sepolia Testnet",
  shortName: "mintsepoliatest",
  chain: "ETH",
  icon: "mintTestnet",
  rpc: ["https://sepolia-testnet-rpc.mintchain.io"],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.mintchain.io",
  chainId: 1687,
  networkId: 1687,
  explorers: [
    {
      name: "blockscout",
      url: "https://sepolia-testnet-explorer.mintchain.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://sepolia-testnet-bridge.mintchain.io",
      },
    ],
  },
} satisfies Chain
