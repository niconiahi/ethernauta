import type { Chain } from "../shared"

export const eip155_15885 = {
  name: "Bitroot Testnet",
  shortName: "bitroot-testnet",
  chain: "Bitroot",
  rpc: ["https://testnet-rpc.bitroot.co"],
  faucets: ["https://faucet.bitroot.co"],
  nativeCurrency: {
    name: "BRT",
    symbol: "BRT",
    decimals: 18,
  },
  infoURL: "https://bitroot.co",
  chainId: 15885,
  networkId: 15885,
  explorers: [
    {
      name: "Bitroot Testnet Explorer",
      url: "https://testnet-explorer.bitroot.co",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
