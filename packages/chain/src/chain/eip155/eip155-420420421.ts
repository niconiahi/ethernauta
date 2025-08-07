// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_420420421 = {
  name: "Westend Asset Hub",
  shortName: "wst",
  chain: "WST",
  rpc: ["https://westend-asset-hub-eth-rpc.polkadot.io"],
  faucets: ["https://faucet.polkadot.io/westend"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Westies",
    symbol: "WND",
    decimals: 18,
  },
  infoURL: "https://polkadot.network",
  chainId: 420420421,
  networkId: 420420421,
  explorers: [
    {
      name: "subscan",
      url: "https://westend-asset-hub-eth-explorer.parity.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
