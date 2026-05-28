import type { Chain } from "../shared"

export const eip155_1663 = {
  name: "Horizen Gobi Testnet",
  shortName: "Gobi",
  chain: "Gobi",
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
    name: "Testnet Zen",
    symbol: "tZEN",
    decimals: 18,
  },
  infoURL: "https://horizen.io/",
  chainId: 1663,
  networkId: 1663,
  slip44: 1,
  explorers: [],
  status: "deprecated",
} satisfies Chain
