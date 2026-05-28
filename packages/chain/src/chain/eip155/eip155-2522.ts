import type { Chain } from "../shared"

export const eip155_2522 = {
  name: "Fraxtal Testnet",
  shortName: "fraxtal-testnet",
  chain: "FRAX",
  icon: "fraxtal",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Frax",
    symbol: "FRAX",
    decimals: 18,
  },
  infoURL: "https://testnet.frax.com",
  chainId: 2522,
  networkId: 2522,
  slip44: 1,
  explorers: [],
  status: "deprecated",
} satisfies Chain
