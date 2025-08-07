// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_217 = {
  name: "SiriusNet V2",
  shortName: "SIN2",
  chain: "SIN2",
  icon: "siriusnet",
  rpc: ["https://rpc2.siriusnet.io"],
  faucets: [],
  nativeCurrency: {
    name: "MCD",
    symbol: "MCD",
    decimals: 18,
  },
  infoURL: "https://siriusnet.io",
  chainId: 217,
  networkId: 217,
  explorers: [
    {
      name: "siriusnet explorer",
      url: "https://scan.siriusnet.io",
      standard: "none",
    },
  ],
} satisfies Chain
