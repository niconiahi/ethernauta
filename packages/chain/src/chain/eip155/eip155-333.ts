import type { Chain } from "../shared"

export const eip155_333 = {
  name: "EthStorage Mainnet",
  shortName: "es-m",
  chain: "EthStorage",
  rpc: ["https://rpc.mainnet.ethstorage.io:9540"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://ethstorage.io/",
  chainId: 333,
  networkId: 333,
  slip44: 1,
  parent: {
    type: "L2",
    chain: "eip155-1",
  },
  status: "incubating",
  redFlags: ["reusedChainId"],
} satisfies Chain
