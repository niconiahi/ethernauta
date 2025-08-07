// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3799 = {
  name: "Tangle Testnet",
  shortName: "tTangle",
  chain: "Tangle Testnet",
  icon: "tangle",
  rpc: [
    "https://testnet-rpc.tangle.tools",
    "https://testnet-rpc-archive.tangle.tools",
    "wss://testnet-rpc.tangle.tools",
    "wss://testnet-rpc-archive.tangle.tools",
  ],
  faucets: ["https://faucet.tangle.tools"],
  nativeCurrency: {
    name: "Testnet Tangle Network Token",
    symbol: "tTNT",
    decimals: 18,
  },
  infoURL: "https://docs.tangle.tools",
  chainId: 3799,
  networkId: 3799,
  explorers: [
    {
      name: "ttntscan",
      url: "https://testnet-explorer.tangle.tools",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
