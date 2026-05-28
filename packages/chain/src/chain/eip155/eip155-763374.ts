import type { Chain } from "../shared"

export const eip155_763374 = {
  name: "Surge deprecated Testnet",
  shortName: "surge-deprecated-testnet",
  chain: "Surge deprecated Testnet",
  icon: "surge-testnet",
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
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "",
  chainId: 763374,
  networkId: 763374,
  explorers: [],
  status: "deprecated",
} satisfies Chain
