import type { Chain } from "../shared"

export const eip155_69420 = {
  name: "CHEESE Blockchain",
  shortName: "cheese",
  chain: "CHEESE",
  rpc: [
    "https://cheesescan.com/rpc",
    "https://rpc1.cheesescan.com",
    "https://rpc2.cheesescan.com",
  ],
  faucets: ["https://cheesescan.com/faucet"],
  nativeCurrency: {
    name: "CHEESE",
    symbol: "CHEESE",
    decimals: 18,
  },
  infoURL: "https://cheesescan.com",
  chainId: 69420,
  networkId: 69420,
  explorers: [
    {
      name: "CHEESE Explorer",
      url: "https://cheesescan.com",
      standard: "EIP3091",
    },
  ],
  status: "incubating",
  redFlags: ["reusedChainId"],
} satisfies Chain
