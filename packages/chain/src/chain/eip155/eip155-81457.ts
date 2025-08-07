// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_81457 = {
  name: "Blast",
  shortName: "blastmainnet",
  chain: "ETH",
  icon: "blast",
  rpc: [
    "https://rpc.blast.io",
    "https://rpc.ankr.com/blast",
    "https://blast.din.dev/rpc",
    "https://blastl2-mainnet.public.blastapi.io",
    "https://blast.blockpi.network/v1/rpc/public",
    "https://blast-rpc.publicnode.com",
    "wss://blast-rpc.publicnode.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://blast.io/",
  chainId: 81457,
  networkId: 81457,
  explorers: [
    {
      name: "Blastscan",
      url: "https://blastscan.io",
      standard: "EIP3091",
    },
    {
      name: "Blast Explorer",
      url: "https://blastexplorer.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
  },
  status: "active",
} satisfies Chain
