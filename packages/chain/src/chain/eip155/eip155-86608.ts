import type { Chain } from "../shared"

export const eip155_86608 = {
  name: "CpChain Mainnet",
  shortName: "cpchain",
  chain: "CpChain",
  icon: "cpchain",
  rpc: ["https://rpc.cpchain.com"],
  faucets: [],
  nativeCurrency: {
    name: "CP",
    symbol: "CP",
    decimals: 18,
  },
  infoURL: "https://cpchain.com",
  chainId: 86608,
  networkId: 86608,
  slip44: 1,
  explorers: [
    {
      name: "CpChain Explorer",
      url: "https://explorer.cpchain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
