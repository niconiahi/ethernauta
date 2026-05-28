import type { Chain } from "../shared"

export const eip155_20250407 = {
  name: "PlatON Dev Testnet",
  shortName: "platondev3",
  chain: "PlatON",
  icon: "platon",
  rpc: [
    "https://devnet3openapi.platon.network/rpc",
    "wss://devnet3openapi.platon.network/ws",
  ],
  faucets: ["https://devnet3faucet.platon.network/faucet"],
  nativeCurrency: {
    name: "LAT",
    symbol: "lat",
    decimals: 18,
  },
  infoURL: "https://www.platon.network",
  chainId: 20250407,
  networkId: 1,
  slip44: 1,
  explorers: [
    {
      name: "PlatON devnet explorer",
      url: "https://devnet3scan.platon.network",
      standard: "none",
    },
  ],
} satisfies Chain
