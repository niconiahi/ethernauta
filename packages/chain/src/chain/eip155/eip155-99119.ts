import type { Chain } from "../shared"

export const eip155_99119 = {
  name: "Dorsen Testnet",
  shortName: "dorsen-main",
  chain: "Dorsen",
  icon: "dorsen",
  rpc: ["https://testnet-rpc.dorsenscan.io"],
  faucets: ["https://faucet.dorsenscan.io"],
  nativeCurrency: {
    name: "Dorsen Chain",
    symbol: "tDC",
    decimals: 18,
  },
  infoURL: "https://docs.dorsenscan.io",
  chainId: 99119,
  networkId: 99119,
  explorers: [
    {
      name: "DorsenScan Testnet",
      url: "https://testnet.dorsenscan.io",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
