import type { Chain } from "../shared"

export const eip155_511111 = {
  name: "Alpha Chain Testnet",
  shortName: "alpha-testnet",
  chain: "Alpha Chain",
  icon: "alphachain",
  rpc: ["https://testnet-rpc.goalpha.org"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL:
    "https://docs.alphatoken.com/AlphaChain/about-alpha-chain",
  chainId: 511111,
  networkId: 511111,
  slip44: 1,
  explorers: [
    {
      name: "Alpha Chain Testnet Scan",
      url: "https://testnet-scan.goalpha.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
