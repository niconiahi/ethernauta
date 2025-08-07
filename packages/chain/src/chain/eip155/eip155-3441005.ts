// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3441005 = {
  name: "Manta Pacific Testnet",
  shortName: "mantaTestnet",
  chain: "Manta Pacific",
  icon: "manta",
  rpc: [
    "https://manta-testnet.calderachain.xyz/http",
    "https://manta-pacific-testnet.drpc.org",
    "wss://manta-pacific-testnet.drpc.org",
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
    name: "Manta",
    symbol: "MANTA",
    decimals: 18,
  },
  infoURL: "https://manta-testnet.caldera.dev/",
  chainId: 3441005,
  networkId: 3441005,
  slip44: 1,
  explorers: [
    {
      name: "manta-testnet Explorer",
      url: "https://manta-testnet.calderaexplorer.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
