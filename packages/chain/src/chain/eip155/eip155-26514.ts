import type { Chain } from "../shared"

export const eip155_26514 = {
  name: "Horizen Mainnet",
  shortName: "horizen",
  chain: "horizen",
  icon: "horizen",
  rpc: ["https://horizen.calderachain.xyz/http"],
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
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://horizen.hub.caldera.xyz",
  chainId: 26514,
  networkId: 26514,
  explorers: [
    {
      name: "Horizen Mainnet Caldera Explorer",
      url: "https://horizen.calderaexplorer.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
