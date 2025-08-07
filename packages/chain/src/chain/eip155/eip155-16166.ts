// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_16166 = {
  name: "Cypherium Mainnet",
  shortName: "cph",
  chain: "CPH",
  rpc: ["https://pubnodes.cypherium.io/rpc"],
  faucets: [],
  nativeCurrency: {
    name: "Cypherium",
    symbol: "CPH",
    decimals: 18,
  },
  infoURL: "https://www.cypherium.io/",
  chainId: 16166,
  networkId: 16166,
  explorers: [
    {
      name: "Testnet Block Explorer",
      url: "https://cypherium.tryethernal.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
