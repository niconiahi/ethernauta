import type { Chain } from "../shared"

export const eip155_16661 = {
  name: "0G Mainnet",
  shortName: "0g",
  chain: "0G",
  icon: "0g",
  rpc: ["https://evmrpc.0g.ai"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "0G",
    symbol: "0G",
    decimals: 18,
  },
  infoURL: "https://0g.ai",
  chainId: 16661,
  networkId: 16661,
  explorers: [
    {
      name: "0G Chainscan",
      url: "https://chainscan.0g.ai",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
