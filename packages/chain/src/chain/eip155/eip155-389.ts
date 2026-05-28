import type { Chain } from "../shared"

export const eip155_389 = {
  name: "LunaroChain Mainnet",
  shortName: "lnr",
  chain: "LNR",
  icon: "lunaro",
  rpc: ["https://rpc.lunaro.network"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Lunaro",
    symbol: "LNR",
    decimals: 18,
  },
  infoURL: "https://lunaro.network",
  chainId: 389,
  networkId: 389,
  explorers: [
    {
      name: "LunaroScan",
      url: "https://scan.lunaro.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
