import type { Chain } from "../shared"

export const eip155_2129 = {
  name: "Memento Testnet",
  shortName: "memento-testnet",
  chain: "Memento",
  rpc: ["https://rpc.memento.zeeve.online"],
  faucets: ["https://faucet.memento.zeeve.online"],
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
  chainId: 2129,
  networkId: 2129,
  explorers: [],
} satisfies Chain
