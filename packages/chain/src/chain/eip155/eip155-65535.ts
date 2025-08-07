// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_65535 = {
  name: "CyberChain Mainnet",
  shortName: "xcc",
  chain: "XCC",
  icon: "cyberchain",
  rpc: ["https://rpc.cyberchain.xyz/"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "XCC",
    symbol: "XCC",
    decimals: 18,
  },
  infoURL: "https://cyberchain.xyz",
  chainId: 65535,
  networkId: 65535,
  slip44: 60,
  explorers: [
    {
      name: "CyberChain explorer",
      url: "https://scan.cyberchain.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
