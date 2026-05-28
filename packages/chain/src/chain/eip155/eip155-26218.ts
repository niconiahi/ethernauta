import type { Chain } from "../shared"

export const eip155_26218 = {
  name: "Integra Testnet Ormos",
  shortName: "integra-testnet",
  chain: "Integra",
  rpc: ["https://ormos.integralayer.com/rpc"],
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
    name: "Integra",
    symbol: "IRL",
    decimals: 18,
  },
  infoURL: "https://integralayer.com",
  chainId: 26218,
  networkId: 26218,
  slip44: 1,
  explorers: [
    {
      name: "Integra Testnet Blockscout",
      url: "https://testnet.blockscout.integralayer.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
