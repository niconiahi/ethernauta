import type { Chain } from "../shared"

export const eip155_3111 = {
  name: "Alpha Chain Mainnet",
  shortName: "alpha",
  chain: "Alpha Chain",
  icon: "alphachain",
  rpc: ["https://rpc.goalpha.org"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL:
    "https://docs.alphatoken.com/AlphaChain/about-alpha-chain",
  chainId: 3111,
  networkId: 3111,
  slip44: 1,
  explorers: [
    {
      name: "Alpha Chain Scan",
      url: "https://scan.goalpha.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
