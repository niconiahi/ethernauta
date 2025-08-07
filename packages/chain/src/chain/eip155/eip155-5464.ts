// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5464 = {
  name: "Saga",
  shortName: "saga",
  chain: "SAGA",
  icon: "saga",
  rpc: ["http://sagaevm-5464-1.jsonrpc.sagarpc.io"],
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
      url: "https://sagaevm-5464-1.sagaexplorer.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
