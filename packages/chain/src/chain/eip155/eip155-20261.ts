import type { Chain } from "../shared"

export const eip155_20261 = {
  name: "MACos Chain",
  shortName: "macos",
  chain: "MACOS",
  icon: "macos",
  rpc: ["https://rpc1.codeupp.xyz"],
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
    name: "MACos Coin",
    symbol: "MCOS",
    decimals: 18,
  },
  infoURL: "https://macosscan.codeupp.xyz",
  chainId: 20261,
  networkId: 20261,
  explorers: [
    {
      name: "MACos Explorer",
      url: "https://macosscan.codeupp.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
