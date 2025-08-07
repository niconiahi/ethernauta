// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2713017997578000 = {
  name: "DCHAIN Testnet",
  shortName: "dchaint",
  title: "DCHAIN Testnet",
  chain: "dchaint",
  icon: "dchaint",
  rpc: [
    "https://dchaintestnet-2713017997578000-1.jsonrpc.testnet.sagarpc.io",
  ],
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
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.dchain.foundation/",
  chainId: 2713017997578000,
  networkId: 2713017997578000,
  explorers: [
    {
      name: "dchaint scan",
      url: "https://dchaintestnet-2713017997578000-1.testnet.sagaexplorer.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
