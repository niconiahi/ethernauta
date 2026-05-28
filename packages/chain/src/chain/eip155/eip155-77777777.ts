import type { Chain } from "../shared"

export const eip155_77777777 = {
  name: "Cryptos Testnet Beta",
  shortName: "cryptos-testnet-beta",
  chain: "CRYPTOS",
  rpc: ["https://rpc-testnet-beta-evm.cryptos.com"],
  faucets: [],
  nativeCurrency: {
    name: "Cryptos",
    symbol: "CRPTOS",
    decimals: 18,
  },
  infoURL: "https://cryptos.com",
  chainId: 77777777,
  networkId: 77777777,
  explorers: [
    {
      name: "Cryptos Explorer (Testnet Beta)",
      url: "https://explorer-beta.cryptos.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
