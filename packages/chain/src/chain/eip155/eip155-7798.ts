// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7798 = {
  name: "OpenEX LONG Testnet",
  shortName: "oex",
  title: "OpenEX LONG Testnet",
  chain: "OEX",
  icon: "oex",
  rpc: ["https://long.rpc.openex.network/"],
  faucets: ["https://long.hub.openex.network/faucet"],
  nativeCurrency: {
    name: "USDT Testnet",
    symbol: "USDT",
    decimals: 18,
  },
  infoURL: "https://openex.network",
  chainId: 7798,
  networkId: 7798,
  slip44: 1,
  explorers: [
    {
      name: "OpenEX Long Testnet Explorer",
      url: "https://scan.long.openex.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
