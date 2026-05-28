import type { Chain } from "../shared"

export const eip155_723487 = {
  name: "Radius Network",
  shortName: "radius",
  chain: "RADIUS",
  icon: "rad",
  rpc: ["https://rpc.radiustech.xyz"],
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
    name: "Radius USD",
    symbol: "RUSD",
    decimals: 18,
  },
  infoURL: "https://network.radiustech.xyz/",
  chainId: 723487,
  networkId: 723487,
  explorers: [
    {
      name: "Radius Network Explorer",
      url: "https://network.radiustech.xyz",
      standard: "none",
    },
  ],
} satisfies Chain
