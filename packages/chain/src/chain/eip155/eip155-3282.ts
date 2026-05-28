import type { Chain } from "../shared"

export const eip155_3282 = {
  name: "Irys Mainnet Beta",
  shortName: "irys-mainnet-beta",
  chain: "IRYS",
  icon: "irys",
  rpc: [
    "https://mainnet-beta-rpc.irys.xyz/v1/execution-rpc",
    "https://mainnet-beta-rpc-2.irys.xyz/v1/execution-rpc",
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
  chainId: 3282,
  networkId: 3282,
  explorers: [
    {
      name: "Irys Mainnet Beta Explorer",
      url: "https://evm-explorer.irys.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
