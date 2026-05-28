import type { Chain } from "../shared"

export const eip155_420420422 = {
  name: "Paseo PassetHub",
  shortName: "pash",
  chain: "PAS",
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
    name: "PAS",
    symbol: "PAS",
    decimals: 18,
  },
  infoURL: "https://polkadot.network",
  chainId: 420420422,
  networkId: 420420422,
  status: "deprecated",
} satisfies Chain
