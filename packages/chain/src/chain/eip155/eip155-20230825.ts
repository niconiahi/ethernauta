// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_20230825 = {
  name: "Vcity Testnet",
  shortName: "Vcitytestnet",
  chain: "VCITY",
  icon: "vcity",
  rpc: ["http://testnet-rpc.vcity.app"],
  faucets: [],
  features: [],
  nativeCurrency: {
    name: "Testnet Vcity Token",
    symbol: "VCT",
    decimals: 18,
  },
  infoURL: "https://vcity.app",
  chainId: 20230825,
  networkId: 20230825,
  explorers: [
    {
      name: "Vcity Explorer",
      url: "https://scan.vcity.app",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
