// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_215 = {
  name: "IDN Mainnet",
  shortName: "IDN",
  chain: "IDN",
  icon: "idn",
  rpc: [
    "https://dataseed1.idn-rpc.com",
    "https://dataseed2.idn-rpc.com",
    "https://dataseed3.idn-rpc.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "IDN",
    symbol: "IDN",
    decimals: 18,
  },
  infoURL: "https://www.idn.world",
  chainId: 215,
  networkId: 215,
  explorers: [
    {
      name: "Idn Explorer",
      url: "https://scan.idn-network.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
