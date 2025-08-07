// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1811 = {
  name: "Lif3 Chain Testnet",
  shortName: "lif3-testnet",
  chain: "lif3chain",
  icon: "lif3",
  rpc: ["https://testnet-evm.lif3.com"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "LIF3",
    symbol: "LIF3",
    decimals: 18,
  },
  infoURL: "https://docs.lif3.com/",
  chainId: 1811,
  networkId: 1811,
  explorers: [
    {
      name: "lif3scout",
      url: "https://testnet.lif3scout.com",
      standard: "none",
    },
  ],
} satisfies Chain
