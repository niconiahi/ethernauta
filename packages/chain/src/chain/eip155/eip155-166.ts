import type { Chain } from "../shared"

export const eip155_166 = {
  name: "Nomina",
  shortName: "nom",
  chain: "Nomina",
  icon: "nom",
  rpc: [
    "https://mainnet.nomina.io",
    "wss://wss.mainnet.nomina.io",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Nomina",
    symbol: "NOM",
    decimals: 18,
  },
  infoURL: "https://docs.omni.network",
  chainId: 166,
  networkId: 166,
  slip44: 1,
  explorers: [
    {
      name: "Nomina EVM and cross-chain Explorer",
      url: "https://nomscan.io",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
