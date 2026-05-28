import type { Chain } from "../shared"

export const eip155_11812 = {
  name: "ARK Testnet",
  shortName: "ark-testnet",
  chain: "ARK",
  icon: "ark",
  rpc: ["https://testnet.mainsailhq.com/rpc"],
  faucets: ["https://faucet.mainsailhq.com"],
  nativeCurrency: {
    name: "DARK Token",
    symbol: "DARK",
    decimals: 18,
  },
  infoURL: "https://ark.io",
  chainId: 11812,
  networkId: 11812,
  slip44: 60,
  explorers: [
    {
      name: "ARK Testnet Explorer",
      url: "https://explorer-demo.mainsailhq.com",
      standard: "none",
    },
  ],
  status: "incubating",
} satisfies Chain
