// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_101003 = {
  name: "Socotra JUNE-Chain",
  shortName: "Socotra-JUNE",
  chain: "Socotra JUNE-Chain",
  icon: "juneoSocotraTestnet",
  rpc: [
    "https://rpc.socotra-testnet.network/ext/bc/JUNE/rpc",
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
    name: "Socotra JUNE",
    symbol: "JUNE",
    decimals: 18,
  },
  infoURL: "https://juneo.com/",
  chainId: 101003,
  networkId: 101003,
  explorers: [
    {
      name: "Juneo Scan",
      url: "https://socotra.juneoscan.io/chain/2",
      standard: "none",
    },
  ],
} satisfies Chain
