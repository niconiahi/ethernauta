// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_555777 = {
  name: "Xsolla ZK Sepolia Testnet",
  shortName: "xsollazk-sepolia",
  chain: "Xsolla ZK Sepolia",
  icon: "xsollazk",
  rpc: ["https://zkrpc-sepolia.xsollazk.com"],
  faucets: ["https://xsollazk.com/faucet"],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://xsolla.com/zk",
  chainId: 555777,
  networkId: 555777,
  slip44: 1,
  explorers: [
    {
      name: "Xsolla ZK Sepolia Block Explorer",
      url: "https://x.la/explorer",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
