import type { Chain } from "../shared"

export const eip155_60600 = {
  name: "POTOS Testnet",
  shortName: "potos-testnet",
  chain: "POTOS",
  icon: "potos",
  rpc: ["https://rpc-testnet.potos.hk"],
  faucets: ["https://faucet-testnet.potos.hk"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "POTOS Token",
    symbol: "POT",
    decimals: 18,
  },
  infoURL: "https://potos.hk",
  chainId: 60600,
  networkId: 60600,
  explorers: [
    {
      name: "POTOS Testnet explorer",
      url: "https://scan-testnet.potos.hk",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
