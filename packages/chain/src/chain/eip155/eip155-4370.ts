import type { Chain } from "../shared"

export const eip155_4370 = {
  name: "ILITY Mainnet",
  shortName: "ily",
  chain: "ILY",
  icon: "ility",
  rpc: ["https://rpc.ility.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "ILITY",
    symbol: "ILY",
    decimals: 18,
  },
  infoURL: "https://ility.xyz",
  chainId: 4370,
  networkId: 4370,
  explorers: [
    {
      name: "ILITY Mainnet Explorer",
      url: "https://scan.ility.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
