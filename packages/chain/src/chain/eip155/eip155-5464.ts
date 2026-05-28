import type { Chain } from "../shared"

export const eip155_5464 = {
  name: "SagaEVM",
  shortName: "sagaevm",
  chain: "SagaEVM",
  icon: "sagaevm",
  rpc: ["https://sagaevm.jsonrpc.sagarpc.io"],
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
    name: "gas",
    symbol: "GAS",
    decimals: 18,
  },
  infoURL: "https://www.saga.xyz",
  chainId: 5464,
  networkId: 5464,
  explorers: [
    {
      name: "blockscout",
      url: "https://sagaevm.sagaexplorer.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
