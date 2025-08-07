// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_918 = {
  name: "SlerfChain Mainnet",
  shortName: "SlerfChain-Mainnet",
  title: "SlerfChain Mainnet",
  chain: "SLERF CHAIN",
  icon: "slerf",
  rpc: ["https://rpc.slerfchain.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "WSLERF",
    symbol: "WSLERF",
    decimals: 18,
  },
  infoURL: "https://slerfchain.xyz",
  chainId: 918,
  networkId: 918,
  explorers: [
    {
      name: "SlerfChain Scan",
      url: "https://scan.slerfchain.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
