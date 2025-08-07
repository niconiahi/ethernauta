// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_50104 = {
  name: "Sophon",
  shortName: "sophon",
  chain: "Sophon",
  rpc: [
    "https://rpc.sophon.xyz",
    "wss://rpc.sophon.xyz/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Sophon",
    symbol: "SOPH",
    decimals: 18,
  },
  infoURL: "",
  chainId: 50104,
  networkId: 50104,
  explorers: [
    {
      name: "Sophon Block Explorer",
      url: "https://explorer.sophon.xyz",
      standard: "none",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://portal.sophon.xyz/bridge",
      },
    ],
  },
} satisfies Chain
