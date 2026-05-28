import type { Chain } from "../shared"

export const eip155_19478 = {
  name: "Trustivon Testnet",
  shortName: "trustivon",
  chain: "Trustivon",
  icon: "trustivon",
  rpc: ["https://rpc.trustivon.com"],
  faucets: ["https://faucet.trustivon.com"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Trustivon",
    symbol: "TC",
    decimals: 18,
  },
  infoURL: "https://trustivon.com",
  chainId: 19478,
  networkId: 19478,
  explorers: [
    {
      name: "Trustivon Explorer",
      url: "https://scan.trustivon.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
