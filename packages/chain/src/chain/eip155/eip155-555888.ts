// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_555888 = {
  name: "DustBoy IoT",
  shortName: "DustBoy_IoT",
  title: "DustBoy IoT",
  chain: "DUSTBOY",
  icon: "dustboy",
  rpc: ["https://dustboy-rpc.jibl2.com/"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "DST",
    decimals: 18,
  },
  infoURL: "https://www.cmuccdc.org/",
  chainId: 555888,
  networkId: 555888,
  slip44: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://dustboy.jibl2.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
  },
  status: "active",
} satisfies Chain
