import type { Chain } from "../shared"

export const eip155_69923 = {
  name: "ILITY Testnet",
  shortName: "ilyt",
  chain: "ILY",
  icon: "ility",
  rpc: ["https://rpc.testnet.ility.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "ILITY Token",
    symbol: "ILYt",
    decimals: 18,
  },
  infoURL: "https://ility.xyz",
  chainId: 69923,
  networkId: 69923,
  explorers: [
    {
      name: "ILITY Testnet Explorer",
      url: "https://scan.testnet.ility.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
