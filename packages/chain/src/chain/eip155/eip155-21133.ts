import type { Chain } from "../shared"

export const eip155_21133 = {
  name: "All About Health",
  shortName: "aah",
  chain: "AAH",
  rpc: ["https://rpc.aah.name"],
  faucets: ["https://aah.name"],
  nativeCurrency: {
    name: "AAH",
    symbol: "AAH",
    decimals: 18,
  },
  infoURL: "https://aah.name",
  chainId: 21133,
  networkId: 21133,
  explorers: [
    {
      name: "AAH Blockscout",
      url: "https://exp.aah.name",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
