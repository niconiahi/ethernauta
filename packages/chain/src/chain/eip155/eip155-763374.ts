// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_763374 = {
  name: "Surge Testnet",
  shortName: "surge-testnet",
  chain: "Surge Testnet",
  icon: "surge-testnet",
  rpc: [
    "https://l2-rpc.surge.staging-nethermind.xyz",
    "wss://l2-rpc.surge.staging-nethermind.xyz",
  ],
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
  infoURL: "https://surge.wtf",
  chainId: 763374,
  networkId: 763374,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.holesky.surge.wtf",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
