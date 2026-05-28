import type { Chain } from "../shared"

export const eip155_1270 = {
  name: "Irys Testnet V1",
  shortName: "irys-testnet-v1",
  chain: "IRYS",
  icon: "irys",
  rpc: [
    "https://testnet-rpc.irys.xyz/v1/execution-rpc",
    "https://testnet-rpc-2.irys.xyz/v1/execution-rpc",
  ],
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
    name: "Irys",
    symbol: "IRYS",
    decimals: 18,
  },
  infoURL: "https://irys.xyz",
  chainId: 1270,
  networkId: 1270,
  explorers: [
    {
      name: "Irys Testnet Explorer",
      url: "https://testnet-explorer.irys.xyz",
      standard: "none",
    },
  ],
} satisfies Chain
