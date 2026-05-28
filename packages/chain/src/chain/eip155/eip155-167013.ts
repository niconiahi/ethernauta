import type { Chain } from "../shared"

export const eip155_167013 = {
  name: "Taiko Hoodi",
  shortName: "tko-hoodi",
  chain: "ETH",
  icon: "taiko",
  rpc: ["https://rpc.hoodi.taiko.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://taiko.xyz",
  chainId: 167013,
  networkId: 167013,
  explorers: [
    {
      name: "Blockscout",
      url: "https://blockscout.hoodi.taiko.xyz",
      standard: "EIP3091",
    },
    {
      name: "Etherscan",
      url: "https://hoodi.taikoscan.io",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
