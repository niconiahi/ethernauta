import type { Chain } from "../shared"

export const eip155_6913 = {
  name: "billions-testnet",
  shortName: "billionstest",
  title: "billions-testnet",
  chain: "billions-testnet",
  icon: "billions",
  rpc: [
    "https://billions-testnet-rpc.eu-north-2.gateway.fm",
  ],
  faucets: [
    "https://billions-testnet-faucet.eu-north-2.gateway.fm",
  ],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://billions.network",
  chainId: 6913,
  networkId: 6913,
  explorers: [
    {
      name: "Billions Testnet Explorer",
      url: "https://billions-testnet-blockscout.eu-north-2.gateway.fm",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://billions-testnet-bridge.eu-north-2.gateway.fm",
      },
    ],
  },
  status: "active",
} satisfies Chain
