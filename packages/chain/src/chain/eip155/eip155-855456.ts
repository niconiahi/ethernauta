// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_855456 = {
  name: "Dodao",
  shortName: "dodao",
  chain: "EVMCC",
  icon: "dodao",
  rpc: [
    "https://fraa-flashbox-4643-rpc.a.stagenet.tanssi.network",
    "wss://fraa-flashbox-4643-rpc.a.stagenet.tanssi.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Dodao",
    symbol: "DODAO",
    decimals: 18,
  },
  infoURL: "https://dodao.dev/",
  chainId: 855456,
  networkId: 855456,
  explorers: [
    {
      name: "Dodao EVM Explorer",
      url: "https://evmexplorer.tanssi-chains.network/?rpcUrl=https://fraa-flashbox-4643-rpc.a.stagenet.tanssi.network",
      standard: "none",
    },
    {
      name: "Dodao Polkadot Explorer",
      url: "https://polkadot.js.org/apps/?rpc=wss://fraa-flashbox-4643-rpc.a.stagenet.tanssi.network#/explorer",
      standard: "none",
    },
  ],
} satisfies Chain
