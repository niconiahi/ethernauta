// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_978658 = {
  name: "Treasure Topaz",
  shortName: "treasure-topaz",
  chain: "Treasure Topaz",
  icon: "treasuretopaz",
  rpc: [
    "https://rpc.topaz.treasure.lol",
    "wss://rpc.topaz.treasure.lol/ws",
  ],
  faucets: [
    "https://app.treasure.lol/chain/faucet",
    "https://thirdweb.com/treasure-topaz",
  ],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Testnet MAGIC",
    symbol: "MAGIC",
    decimals: 18,
  },
  infoURL: "https://app.treasure.lol",
  chainId: 978658,
  networkId: 978658,
  slip44: 1,
  explorers: [
    {
      name: "Treasure Topaz Block Explorer",
      url: "https://topaz.treasurescan.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://app.treasure.lol/chain/bridge",
      },
    ],
  },
} satisfies Chain
