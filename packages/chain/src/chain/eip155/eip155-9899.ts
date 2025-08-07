// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9899 = {
  name: "Arena-Z-Testnet",
  shortName: "arena-z-testnet",
  title: "Arena-Z-Testnet",
  chain: "arena-z-testnet",
  icon: "arena-z",
  rpc: [
    "https://testnet-rpc.arena-z.gg",
    "wss://testnet-ws.arena-z.gg",
  ],
  faucets: ["https://testnet-faucet.arena-z.gg"],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL:
    "https://raas.gelato.network/rollups/details/public/arena-z-testnet",
  chainId: 9899,
  networkId: 9899,
  explorers: [
    {
      name: "blockscout",
      url: "https://testnet-explorer.arena-z.gg",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://testnet-bridge.arena-z.gg",
      },
    ],
  },
  status: "active",
} satisfies Chain
