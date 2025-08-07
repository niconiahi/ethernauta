// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_545 = {
  name: "Flow EVM Testnet",
  shortName: "flow-testnet",
  chain: "Flow",
  icon: "flowevm",
  rpc: ["https://testnet.evm.nodes.onflow.org"],
  faucets: ["https://faucet.flow.com/fund-account"],
  nativeCurrency: {
    name: "FLOW",
    symbol: "FLOW",
    decimals: 18,
  },
  infoURL: "https://developers.flow.com/evm/about",
  chainId: 545,
  networkId: 545,
  explorers: [
    {
      name: "FlowScan Testnet",
      url: "https://evm-testnet.flowscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
