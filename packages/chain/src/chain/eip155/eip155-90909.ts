import type { Chain } from "../shared"

export const eip155_90909 = {
  name: "QuantumBit",
  shortName: "qb",
  chain: "QB",
  icon: "quantumbit",
  rpc: ["https://quantumbit.foo/rpc"],
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
    name: "QuantumBit",
    symbol: "QB",
    decimals: 18,
  },
  infoURL: "https://quantumbit.foo",
  chainId: 90909,
  networkId: 90909,
  explorers: [
    {
      name: "QuantumBit Explorer",
      url: "https://quantumbit.foo",
      standard: "none",
    },
  ],
} satisfies Chain
