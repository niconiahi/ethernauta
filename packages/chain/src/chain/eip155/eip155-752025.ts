// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_752025 = {
  name: "Ternoa",
  shortName: "ternoa-mainnet",
  chain: "Ternoa",
  rpc: ["https://rpc-mainnet.zkevm.ternoa.network"],
  faucets: [],
  nativeCurrency: {
    name: "Capsule Coin",
    symbol: "CAPS",
    decimals: 18,
  },
  infoURL: "",
  chainId: 752025,
  networkId: 7502025,
  explorers: [
    {
      name: "Tracehawk",
      url: "https://explorer-mainnet.zkevm.ternoa.network",
      standard: "none",
    },
  ],
} satisfies Chain
