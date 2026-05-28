import type { Chain } from "../shared"

export const eip155_2651420 = {
  name: "Horizen Testnet",
  shortName: "horizen-testnet",
  chain: "horizen",
  icon: "horizen",
  rpc: ["https://horizen-testnet.rpc.caldera.xyz/http"],
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
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://horizen-testnet.hub.caldera.xyz",
  chainId: 2651420,
  networkId: 2651420,
  explorers: [
    {
      name: "Horizen Testnet Caldera Explorer",
      url: "https://horizen-testnet.explorer.caldera.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
