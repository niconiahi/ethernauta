// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_12001 = {
  name: "Fuse Testnet",
  shortName: "fuseZK",
  chain: "Fuse",
  rpc: ["https://rpc.flash.fuse.io"],
  faucets: ["https://faucet.flash.fuse.io"],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "",
  chainId: 12001,
  networkId: 12001,
  explorers: [
    {
      name: "Blockscout",
      url: "https://explorer.flash.fuse.io",
      standard: "none",
    },
  ],
} satisfies Chain
