// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_19600 = {
  name: "LBRY Mainnet",
  shortName: "LBRY",
  chain: "LBRY",
  icon: "lbry",
  rpc: ["https://lbry.nl/rpc"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "LBRY Credits",
    symbol: "LBC",
    decimals: 8,
  },
  infoURL: "https://lbry.com",
  chainId: 19600,
  networkId: 19600,
  slip44: 140,
  explorers: [
    {
      name: "LBRY Block Explorer",
      url: "https://explorer.lbry.com",
      standard: "none",
    },
  ],
} satisfies Chain
