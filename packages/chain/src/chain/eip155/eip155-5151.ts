// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5151 = {
  name: "Moca Chain Testnet",
  shortName: "MOCA",
  chain: "Moca Chain",
  icon: "moca",
  rpc: ["https://testnet-rpc.mechain.tech"],
  faucets: ["https://faucet.mechain.tech"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "MOCA",
    symbol: "MOCA",
    decimals: 18,
  },
  infoURL: "https://mechain.tech",
  chainId: 5151,
  networkId: 5151,
  explorers: [
    {
      name: "Moca Chain Scan",
      url: "https://testnet-scan.mechain.tech",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
