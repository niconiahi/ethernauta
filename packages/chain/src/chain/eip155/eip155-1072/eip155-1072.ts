import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1072: Chain = {
  name: "ShimmerEVM Testnet Deprecated 1072",
  shortName: "shimmerevm-testnet-deprecated-1072",
  title: "ShimmerEVM Testnet Deprecated 1072",
  chain: "ShimmerEVM",
  icon: "shimmerevm",
  rpc: [],
  faucets: [
    "https://evm-toolkit.evm.testnet.shimmer.network",
    "https://evm-faucet.testnet.shimmer.network",
  ],
  nativeCurrency: {
    name: "SMR",
    symbol: "SMR",
    decimals: 6,
  },
  infoURL: "https://shimmer.network",
  chainId: 1072,
  networkId: 1072,
  explorers: [
    {
      name: "explorer",
      url: "https://explorer.evm.testnet.shimmer.network",
      standard: "EIP3091",
    },
  ],
  status: "deprecated",
}
