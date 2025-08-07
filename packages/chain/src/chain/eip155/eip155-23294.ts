// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_23294 = {
  name: "Oasis Sapphire",
  shortName: "sapphire",
  chain: "Sapphire",
  icon: "oasis",
  rpc: [
    "https://sapphire.oasis.io",
    "wss://sapphire.oasis.io/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Sapphire Rose",
    symbol: "ROSE",
    decimals: 18,
  },
  infoURL: "https://docs.oasis.io/dapp/sapphire",
  chainId: 23294,
  networkId: 23294,
  explorers: [
    {
      name: "Oasis Sapphire Explorer",
      url: "https://explorer.oasis.io/mainnet/sapphire",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
