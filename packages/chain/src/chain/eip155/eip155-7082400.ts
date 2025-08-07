// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7082400 = {
  name: "COTI Testnet",
  shortName: "coti-testnet",
  title: "COTI Testnet",
  chain: "COTI",
  icon: "coti",
  rpc: [
    "https://testnet.coti.io/rpc",
    "https://testnet-magnus-validator.coti.io/rpc",
    "https://testnet-minor-validator.coti.io/rpc",
  ],
  faucets: ["https://faucet.coti.io"],
  nativeCurrency: {
    name: "COTI",
    symbol: "COTI",
    decimals: 18,
  },
  infoURL: "https://coti.io/",
  chainId: 7082400,
  networkId: 7082400,
  explorers: [
    {
      name: "COTI Testnet Explorer",
      url: "https://testnet.cotiscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
