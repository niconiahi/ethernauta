// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1903648807 = {
  name: "Gemuchain Testnet",
  shortName: "Gemuchain",
  chain: "Gemuchain",
  rpc: ["https://gemutest-rpc.gemuchain.io"],
  faucets: ["https://faucet.gemuchain.io/"],
  nativeCurrency: {
    name: "Gemuchain",
    symbol: "GEMU",
    decimals: 18,
  },
  infoURL: "https://gemuchain.io/",
  chainId: 1903648807,
  networkId: 1903648807,
  explorers: [
    {
      name: "Gemuchain Explorer (Blockscout)",
      url: "https://gemutest-explorer.gemuchain.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://gemutest-bridge.gemuchain.io/login",
      },
    ],
  },
} satisfies Chain
