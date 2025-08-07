// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_984 = {
  name: "IOPN Testnet",
  shortName: "iopn-Test-Chain",
  chain: "IOPN Testnet",
  rpc: ["https://testnet-rpc.iopn.tech"],
  faucets: ["https://faucet.iopn.tech"],
  nativeCurrency: {
    name: "OPN",
    symbol: "OPN",
    decimals: 18,
  },
  infoURL: "https://iopn.tech",
  chainId: 984,
  networkId: 984,
  explorers: [
    {
      name: "tracehawk",
      url: "https://testnet.iopn.tech",
      standard: "none",
    },
  ],
} satisfies Chain
