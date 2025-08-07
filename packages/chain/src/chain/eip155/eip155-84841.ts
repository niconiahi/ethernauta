// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_84841 = {
  name: "O Chain",
  shortName: "O",
  chain: "O",
  rpc: [
    "https://rpc.o.xyz",
    "https://84841.rpc.thirdweb.com",
    "wss://rpc.o.xyz",
  ],
  faucets: [],
  nativeCurrency: {
    name: "O.XYZ",
    symbol: "O",
    decimals: 18,
  },
  infoURL: "https://o.xyz",
  chainId: 84841,
  networkId: 84841,
  slip44: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.o.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://bridge.o.xyz",
      },
      {
        url: "https://superbridge.o.xyz",
      },
    ],
  },
} satisfies Chain
