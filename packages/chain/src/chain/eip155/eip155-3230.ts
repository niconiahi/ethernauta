import type { Chain } from "../shared"

export const eip155_3230 = {
  name: "C9XChain",
  shortName: "c9xchain",
  chain: "C9XChain",
  icon: "c9xchain",
  rpc: [
    "https://services.tanssi-mainnet.network/tanssi-2002",
    "wss://services.tanssi-mainnet.network/tanssi-2002",
  ],
  faucets: [],
  nativeCurrency: {
    name: "CXC",
    symbol: "CXC",
    decimals: 18,
  },
  infoURL: "https://c9tech.com.br/",
  chainId: 3230,
  networkId: 3230,
  explorers: [
    {
      name: "blockscout",
      url: "https://blockscan-tanssi.c9tech.com.br",
      standard: "none",
    },
  ],
} satisfies Chain
