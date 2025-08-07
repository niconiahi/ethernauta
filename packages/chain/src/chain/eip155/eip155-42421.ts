// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_42421 = {
  name: "Asset Chain Testnet",
  shortName: "rwa",
  chain: "Asset Chain",
  icon: "assetchain",
  rpc: ["https://enugu-rpc.assetchain.org"],
  faucets: ["https://faucet.assetchain.org"],
  nativeCurrency: {
    name: "Real World Asset",
    symbol: "RWA",
    decimals: 18,
  },
  infoURL: "https://docs.assetchain.org",
  chainId: 42421,
  networkId: 42421,
  explorers: [
    {
      name: "Asset Chain Testnet Explorer",
      url: "https://scan-testnet.assetchain.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
