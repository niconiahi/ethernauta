import type { Chain } from "../shared"

export const eip155_7332 = {
  name: "Horizen EON Mainnet",
  shortName: "EON",
  chain: "EON",
  icon: "eon",
  rpc: [],
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
    name: "Zencash",
    symbol: "ZEN",
    decimals: 18,
  },
  infoURL: "https://horizen.io/",
  chainId: 7332,
  networkId: 7332,
  slip44: 121,
  explorers: [],
  status: "deprecated",
} satisfies Chain
