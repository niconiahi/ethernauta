import type { Chain } from "../shared"

export const eip155_72344 = {
  name: "Radius Test Network",
  shortName: "radius-network-testnet",
  chain: "RADIUS",
  icon: "rad",
  rpc: ["https://rpc.testnet.radiustech.xyz"],
  faucets: ["https://testnet.radiustech.xyz/wallet/"],
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
  infoURL: "https://testnet.radiustech.xyz",
  chainId: 72344,
  networkId: 72344,
  slip44: 1,
  explorers: [
    {
      name: "Radius Test Network Explorer",
      url: "https://testnet.radiustech.xyz",
      standard: "none",
    },
  ],
} satisfies Chain
