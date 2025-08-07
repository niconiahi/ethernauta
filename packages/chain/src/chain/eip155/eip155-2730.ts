// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2730 = {
  name: "XR Sepolia",
  shortName: "txr",
  chain: "ETH",
  icon: "xr",
  rpc: ["https://xr-sepolia-testnet.rpc.caldera.xyz/http"],
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
    name: "tXR",
    symbol: "tXR",
    decimals: 18,
  },
  infoURL: "https://xr-one.gitbook.io",
  chainId: 2730,
  networkId: 2730,
  slip44: 60,
  explorers: [
    {
      name: "XR Sepolia Explorer",
      url: "https://xr-sepolia-testnet.explorer.caldera.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-421614",
    bridges: [
      {
        url: "https://xr-sepolia-testnet.bridge.caldera.xyz",
      },
    ],
  },
  status: "active",
} satisfies Chain
