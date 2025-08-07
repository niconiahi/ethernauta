// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1612127 = {
  name: "PlayFi Albireo Testnet",
  shortName: "alberio",
  chain: "ETH",
  rpc: ["https://albireo-rpc.playfi.ai"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.playfi.ai/",
  chainId: 1612127,
  networkId: 1612127,
  slip44: 1,
  explorers: [
    {
      name: "PlayFi Block Explorer",
      url: "https://albireo-explorer.playfi.ai",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://portal.playfi.ai/bridge",
      },
    ],
  },
} satisfies Chain
