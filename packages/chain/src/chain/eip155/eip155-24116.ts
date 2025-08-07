// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_24116 = {
  name: "Amauti",
  shortName: "railst",
  title: "Rails Network Testnet Amauti",
  chain: "RAILS",
  icon: "railsTestnet",
  rpc: ["https://testnet.steamexchange.io"],
  faucets: ["https://depot.steamexchange.io/faucet"],
  nativeCurrency: {
    name: "SteamX",
    symbol: "STEAMX",
    decimals: 18,
  },
  infoURL: "https://steamexchange.io",
  chainId: 24116,
  networkId: 24116,
  explorers: [
    {
      name: "blockscout",
      url: "https://build.steamexchange.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
