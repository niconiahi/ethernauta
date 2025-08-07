// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_168168 = {
  name: "Zchains",
  shortName: "zchains",
  chain: "Zchains",
  icon: "zchain",
  rpc: ["https://rpc.zchains.com"],
  faucets: [],
  nativeCurrency: {
    name: "ZCD",
    symbol: "ZCD",
    decimals: 18,
  },
  infoURL: "https://www.zchains.com/",
  chainId: 168168,
  networkId: 168168,
  explorers: [
    {
      name: "zchains",
      url: "https://scan.zchains.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
