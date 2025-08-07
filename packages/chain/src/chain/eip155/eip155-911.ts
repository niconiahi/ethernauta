// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_911 = {
  name: "TAPROOT Mainnet",
  shortName: "TAPROOT-Mainnet",
  title: "TAPROOT Mainnet",
  chain: "TAPROOT CHAIN",
  icon: "taproot",
  rpc: ["https://rpc.taprootchain.io"],
  faucets: [],
  nativeCurrency: {
    name: "TBTC",
    symbol: "TBTC",
    decimals: 18,
  },
  infoURL: "https://taprootchain.io",
  chainId: 911,
  networkId: 911,
  explorers: [
    {
      name: "TAPROOT Scan",
      url: "https://scan.taprootchain.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
