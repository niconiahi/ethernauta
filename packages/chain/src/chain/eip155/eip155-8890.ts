// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8890 = {
  name: "Orenium Testnet Protocol",
  shortName: "tore",
  chain: "ORE",
  icon: "ore",
  rpc: [
    "https://rpc-dev-testnet.orenium.org/",
    "https://rpc-testnet.orenium.org/",
    "https://rpc-orc.oredex.finance",
    "https://testnet-rpc.oredex.finance",
    "https://oredex-node.oredex.finance",
  ],
  faucets: ["https://faucetcoin.orenium.org"],
  nativeCurrency: {
    name: "ORENIUM",
    symbol: "tORE",
    decimals: 18,
  },
  infoURL: "https://orenium.org",
  chainId: 8890,
  networkId: 8890,
  slip44: 1,
  explorers: [
    {
      name: "ORE Testnet Explorer",
      url: "https://testnet.oreniumscan.org",
      standard: "none",
    },
  ],
} satisfies Chain
