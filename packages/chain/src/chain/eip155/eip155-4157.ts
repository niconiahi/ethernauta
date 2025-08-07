// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4157 = {
  name: "CrossFi Testnet",
  shortName: "crossfi-testnet",
  title: "CrossFi Testnet",
  chain: "XFI",
  icon: "crossfi",
  rpc: ["https://rpc.testnet.ms"],
  faucets: [],
  nativeCurrency: {
    name: "XFI",
    symbol: "XFI",
    decimals: 18,
  },
  infoURL: "https://crossfi.org",
  chainId: 4157,
  networkId: 4157,
  slip44: 1,
  explorers: [
    {
      name: "CrossFi Testnet Scan",
      url: "https://test.xfiscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
