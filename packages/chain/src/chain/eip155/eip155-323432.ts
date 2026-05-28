import type { Chain } from "../shared"

export const eip155_323432 = {
  name: "World Mobile Chain Testnet",
  shortName: "WMCTEST",
  chain: "WOMOX",
  rpc: ["https://worldmobile-testnet.g.alchemy.com/public"],
  faucets: ["https://testnet-faucet.worldmobile.net"],
  nativeCurrency: {
    name: "ATestingToken",
    symbol: "WOMOX",
    decimals: 18,
  },
  infoURL: "https://worldmobile.io/the-chain",
  chainId: 323432,
  networkId: 323432,
  explorers: [
    {
      name: "World Mobile Testnet Explorer",
      url: "https://testnet-explorer.worldmobile.net",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
