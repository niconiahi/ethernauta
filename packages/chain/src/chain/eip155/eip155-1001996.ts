import type { Chain } from "../shared"

export const eip155_1001996 = {
  name: "Wirex Pay Testnet",
  shortName: "wirex-testnet",
  chain: "WirexPay",
  icon: "wpay",
  rpc: ["https://rpc-dev.wirexpaychain.com"],
  faucets: ["https://faucet-dev.wirexpaychain.com"],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL:
    "https://docs.wirexpaychain.com/tech/wirex-pay-chain",
  chainId: 1001996,
  networkId: 1001996,
  explorers: [
    {
      name: "Wirex Pay Testnet Explorer",
      url: "https://explorer-dev.wirexpaychain.com",
      standard: "none",
    },
  ],
} satisfies Chain
