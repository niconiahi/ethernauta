// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_979 = {
  name: "EthXY Testnet",
  shortName: "sexyTestnet",
  chain: "EthXY",
  icon: "sexyTestnet",
  rpc: ["https://rpc.testnet.ethxy.com"],
  faucets: [],
  nativeCurrency: {
    name: "Settled EthXY Token",
    symbol: "SEXY",
    decimals: 18,
  },
  infoURL: "https://ethxy.com",
  chainId: 979,
  networkId: 979,
  explorers: [
    {
      name: "EthXY Testnet Network Explorer",
      url: "https://explorer.testnet.ethxy.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
