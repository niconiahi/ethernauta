import type { Chain } from "../shared"

export const eip155_8700 = {
  name: "Autonomys Chronos Testnet",
  shortName: "ATN",
  chain: "autonomys-chronos-testnet",
  icon: "autonomys",
  rpc: ["https://auto-evm.chronos.autonomys.xyz/ws"],
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
    name: "AI3",
    symbol: "AI3",
    decimals: 18,
  },
  infoURL: "https://www.autonomys.xyz",
  chainId: 8700,
  networkId: 8700,
  explorers: [
    {
      name: "Autonomys Chronos EVM Testnet Explorer",
      url: "https://explorer.auto-evm.chronos.autonomys.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
