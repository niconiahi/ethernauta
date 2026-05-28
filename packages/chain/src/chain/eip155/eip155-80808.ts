import type { Chain } from "../shared"

export const eip155_80808 = {
  name: "HyperX",
  shortName: "hpx",
  chain: "HyperX",
  icon: "hpx",
  rpc: ["https://rpc.hyperx.technology"],
  faucets: ["https://faucet.hyperx.technology"],
  nativeCurrency: {
    name: "HPX",
    symbol: "HPX",
    decimals: 18,
  },
  infoURL: "https://hyperx.technology/",
  chainId: 80808,
  networkId: 80808,
  explorers: [
    {
      name: "HyperX Explorer",
      url: "https://scan.hyperx.technology",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
