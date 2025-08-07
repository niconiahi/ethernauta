// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8726 = {
  name: "Storagechain Mainnet",
  shortName: "stor",
  chain: "Storagechain",
  icon: "storagechain",
  rpc: ["https://mainnet-validator.storagechain.io"],
  faucets: [],
  nativeCurrency: {
    name: "Storagechain",
    symbol: "STOR",
    decimals: 18,
  },
  infoURL: "https://storagechain.io/about-us",
  chainId: 8726,
  networkId: 8726,
  explorers: [
    {
      name: "Storscan",
      url: "https://explorer-storagechain.invo.zone/?network=StorageChain",
      standard: "none",
    },
  ],
} satisfies Chain
