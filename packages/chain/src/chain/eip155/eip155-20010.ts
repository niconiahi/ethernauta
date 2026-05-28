import type { Chain } from "../shared"

export const eip155_20010 = {
  name: "Mandala Chain",
  shortName: "mandala",
  chain: "MANDALA",
  icon: "mandala",
  rpc: ["https://rpc1-mainnet.mandalachain.io"],
  faucets: [],
  nativeCurrency: {
    name: "Kepeng",
    symbol: "KPG",
    decimals: 18,
  },
  infoURL: "https://mandalachain.io",
  chainId: 20010,
  networkId: 20010,
  explorers: [
    {
      name: "Blockscout",
      url: "https://explorer.mandalachain.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://portal.arbitrum.io/bridge?destinationChain=mandala-chain&sanitized=true&sourceChain=ethereum",
      },
    ],
  },
  status: "active",
} satisfies Chain
