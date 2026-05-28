import type { Chain } from "../shared"

export const eip155_5042002 = {
  name: "Arc Network Testnet",
  shortName: "arc-testnet",
  chain: "Arc Network",
  icon: "arcnetwork",
  rpc: [
    "https://rpc.testnet.arc.network",
    "wss://rpc.testnet.arc.network",
    "https://rpc.quicknode.testnet.arc.network",
    "wss://rpc.quicknode.testnet.arc.network",
    "https://rpc.blockdaemon.testnet.arc.network",
  ],
  faucets: ["https://faucet.circle.com/"],
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  infoURL: "https://arc.network",
  chainId: 5042002,
  networkId: 5042002,
  slip44: 1,
  explorers: [
    {
      name: "Arcscan",
      url: "https://testnet.arcscan.app",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
