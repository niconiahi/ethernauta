// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2355 = {
  name: "Silicon zkEVM",
  shortName: "silicon-zk",
  title: "Silicon zkEVM Mainnet",
  chain: "Silicon",
  icon: "silicon",
  rpc: [
    "https://rpc.silicon.network",
    "https://silicon-mainnet.nodeinfra.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://docs.silicon.network",
  chainId: 2355,
  networkId: 2355,
  explorers: [
    {
      name: "siliconscope",
      url: "https://scope.silicon.network",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://bridge.silicon.network",
      },
      {
        url: "https://bridge.orbitchain.io",
      },
    ],
  },
  status: "active",
} satisfies Chain
