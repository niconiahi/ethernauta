// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9789 = {
  name: "Tabi Testnet",
  shortName: "tabitest",
  chain: "TabiNetwork",
  rpc: ["https://rpc.testnet.tabichain.com"],
  faucets: ["https://faucet.testnet.tabichain.com"],
  nativeCurrency: {
    name: "Tabi",
    symbol: "TABI",
    decimals: 18,
  },
  infoURL: "https://www.tabichain.com",
  chainId: 9789,
  networkId: 9789,
  explorers: [
    {
      name: "Tabi Testnet Explorer",
      url: "https://testnet.tabiscan.com",
      standard: "none",
    },
  ],
} satisfies Chain
