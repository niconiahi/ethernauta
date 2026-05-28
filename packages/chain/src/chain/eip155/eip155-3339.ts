import type { Chain } from "../shared"

export const eip155_3339 = {
  name: "EthStorage L2 Devnet",
  shortName: "esl2-d",
  chain: "EthStorage L2",
  rpc: ["https://rpc.devnet.l2.ethstorage.io:9540"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://ethstorage.io/",
  chainId: 3339,
  networkId: 3339,
  slip44: 1,
  status: "incubating",
  redFlags: ["reusedChainId"],
} satisfies Chain
