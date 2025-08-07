// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4040 = {
  name: "Carbonium Testnet Network",
  shortName: "tcbr",
  chain: "CBR",
  icon: "cbr",
  rpc: [
    "https://rpc-dev.carbonium.network/",
    "https://server-testnet.carbonium.network",
  ],
  faucets: ["https://getfaucet.carbonium.network"],
  nativeCurrency: {
    name: "Carbonium",
    symbol: "tCBR",
    decimals: 18,
  },
  infoURL: "https://carbonium.network",
  chainId: 4040,
  networkId: 4040,
  slip44: 1,
  explorers: [
    {
      name: "Carbonium Network tesnet Explorer",
      url: "https://testnet.carboniumscan.com",
      standard: "none",
    },
  ],
} satisfies Chain
