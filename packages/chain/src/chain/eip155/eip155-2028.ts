import type { Chain } from "../shared"

export const eip155_2028 = {
  name: "ArmaChain Testnet",
  shortName: "arma-testnet",
  chain: "ARMA",
  icon: "armachain",
  rpc: ["https://rpc.armascan.io"],
  faucets: ["https://armafaucet.io"],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "tARMA",
    symbol: "tARMA",
    decimals: 18,
  },
  infoURL: "https://armadex.io",
  chainId: 2028,
  networkId: 2028,
  slip44: 1,
  explorers: [
    {
      name: "ArmaScan",
      url: "https://armascan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
