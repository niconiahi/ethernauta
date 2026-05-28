import type { Chain } from "../shared"

export const eip155_13766 = {
  name: "Trexx",
  shortName: "trexx",
  chain: "Trexx",
  icon: "trexx",
  rpc: [
    "https://services.tanssi-mainnet.network/tanssi-2003",
    "wss://services.tanssi-mainnet.network/tanssi-2003",
  ],
  faucets: [],
  nativeCurrency: {
    name: "TRX",
    symbol: "TRX",
    decimals: 18,
  },
  infoURL: "https://trexx.com.br",
  chainId: 13766,
  networkId: 13766,
  explorers: [
    {
      name: "Tanssi EVM Basic Explorer",
      url: "https://evmexplorer.tanssi-chains.network/?rpcUrl=https://services.tanssi-mainnet.network/tanssi-2003",
      standard: "none",
    },
  ],
} satisfies Chain
