// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9696 = {
  name: "Rebus Mainnet",
  shortName: "rebus",
  title: "Rebuschain Mainnet",
  chain: "ETH",
  icon: "rebus",
  rpc: ["https://apievml2.rebuschain.com/l2rpc"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.rebuschain.com",
  chainId: 9696,
  networkId: 9696,
  explorers: [
    {
      name: "Rebus EVM Explorer (Blockscout)",
      url: "https://evm.rebuschain.com",
      standard: "none",
    },
  ],
} satisfies Chain
