// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4058 = {
  name: "Bahamut ocean",
  shortName: "ocean",
  title: "Bahamut ocean",
  chain: "Bahamut",
  icon: "bahamut",
  rpc: ["https://rpc1.ocean.bahamutchain.com"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "FTN",
    symbol: "FTN",
    decimals: 18,
  },
  infoURL: "https://bahamut.io",
  chainId: 4058,
  networkId: 4058,
  explorers: [
    {
      name: "blockscout",
      url: "https://ocean.ftnscan.com",
      standard: "none",
    },
  ],
} satisfies Chain
