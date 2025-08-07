// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_747 = {
  name: "Flow EVM Mainnet",
  shortName: "flow-mainnet",
  chain: "Flow",
  icon: "flowevm",
  rpc: ["https://mainnet.evm.nodes.onflow.org"],
  faucets: [],
  nativeCurrency: {
    name: "FLOW",
    symbol: "FLOW",
    decimals: 18,
  },
  infoURL: "https://developers.flow.com/evm/about",
  chainId: 747,
  networkId: 747,
  explorers: [
    {
      name: "FlowScan",
      url: "https://evm.flowscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
