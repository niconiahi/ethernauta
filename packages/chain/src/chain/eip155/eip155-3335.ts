// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3335 = {
  name: "QuarkChain L2 Beta Testnet",
  shortName: "qkcl2-b",
  chain: "QuarkChain",
  rpc: ["https://rpc.beta.testnet.l2.quarkchain.io:8545"],
  faucets: [],
  nativeCurrency: {
    name: "QKC",
    symbol: "QKC",
    decimals: 18,
  },
  infoURL: "https://www.quarkchain.io",
  chainId: 3335,
  networkId: 3335,
  slip44: 1,
  explorers: [
    {
      name: "quarkchain-beta-test",
      url: "https://explorer.beta.testnet.l2.quarkchain.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
  },
} satisfies Chain
