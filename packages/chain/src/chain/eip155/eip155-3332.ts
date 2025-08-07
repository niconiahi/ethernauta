// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3332 = {
  name: "EthStorage L2 Mainnet",
  shortName: "esl2-m",
  chain: "EthStorage",
  rpc: ["http://mainnet.l2.ethstorage.io:9540"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://ethstorage.io/",
  chainId: 3332,
  networkId: 3332,
  slip44: 1,
  parent: {
    type: "L2",
    chain: "eip155-1",
  },
  status: "incubating",
} satisfies Chain
