import type { Chain } from "../shared"

export const eip155_14601 = {
  name: "Sonic Testnet",
  shortName: "sonic-testnet",
  chain: "sonic-testnet",
  icon: "sonic",
  rpc: ["https://rpc.testnet.soniclabs.com"],
  faucets: ["https://testnet.soniclabs.com/account"],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Sonic",
    symbol: "S",
    decimals: 18,
  },
  infoURL: "https://testnet.soniclabs.com",
  chainId: 14601,
  networkId: 14601,
  explorers: [
    {
      name: "Sonic Testnet Explorer",
      url: "https://explorer.testnet.soniclabs.com",
      standard: "none",
    },
  ],
} satisfies Chain
