// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_19077 = {
  name: "BlockX Atlantis Testnet",
  shortName: "tbcx",
  chain: "blockx",
  rpc: ["https://atlantis-web3.blockxnet.com"],
  faucets: [
    "https://ping.blockxnet.com/blockx-atlantis-testnet/faucet",
  ],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "BCX",
    symbol: "BCX",
    decimals: 18,
  },
  infoURL: "https://www.blockxnet.com/",
  chainId: 19077,
  networkId: 19077,
  explorers: [
    {
      name: "BlockX EVM Explorer (Blockscout)",
      url: "https://testnet-explorer.blockxnet.com",
      standard: "EIP3091",
    },
    {
      name: "BlockX Cosmos Explorer (Ping)",
      url: "https://ping.blockxnet.com/blockx-atlantis-testnet",
      standard: "none",
    },
  ],
} satisfies Chain
