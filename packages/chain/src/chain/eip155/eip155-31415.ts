// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_31415 = {
  name: "Wirex Pay Mainnet",
  shortName: "wpay",
  chain: "WirexPay",
  icon: "wpay",
  rpc: ["https://rpc.wirexpaychain.com"],
  faucets: [],
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL:
    "https://docs.wirexpaychain.com/tech/wirex-pay-chain",
  chainId: 31415,
  networkId: 31415,
  explorers: [
    {
      name: "Wirex Pay Explorer",
      url: "https://blockscout.wirexpaychain.com",
      standard: "EIP3091",
    },
  ],
  redFlags: ["reusedChainId"],
} satisfies Chain
