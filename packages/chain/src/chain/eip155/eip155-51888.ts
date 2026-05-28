import type { Chain } from "../shared"

export const eip155_51888 = {
  name: "Memento Mainnet",
  shortName: "memento-mainnet",
  chain: "Memento",
  rpc: ["https://rpc.mementoblockchain.com"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "",
  chainId: 51888,
  networkId: 51888,
  explorers: [],
} satisfies Chain
