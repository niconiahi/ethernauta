// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_190 = {
  name: "CMDAO BBQ Chain",
  shortName: "cmdao-bbq-chain",
  chain: "Underchain 1",
  rpc: ["https://bbqchain-rpc.commudao.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "CommuDAO",
    symbol: "CMD",
    decimals: 18,
  },
  infoURL: "https://commudao.xyz",
  chainId: 190,
  networkId: 190,
  explorers: [
    {
      name: "bbqchain-explorer",
      url: "https://bbqchain-exp.commudao.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
