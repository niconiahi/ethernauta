// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_42070 = {
  name: "WMC Testnet",
  shortName: "wmtx",
  chain: "WMC",
  icon: "wmc",
  rpc: ["https://rpc-testnet-base.worldmobile.net"],
  faucets: ["https://faucet-testnet-base.worldmobile.net"],
  nativeCurrency: {
    name: "WMTx",
    symbol: "WMTx",
    decimals: 18,
  },
  infoURL: "https://worldmobiletoken.com",
  chainId: 42070,
  networkId: 42070,
  explorers: [
    {
      name: "WMC Explorer",
      url: "https://explorer-testnet-base.worldmobile.net",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
