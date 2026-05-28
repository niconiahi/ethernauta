import type { Chain } from "../shared"

export const eip155_2523 = {
  name: "Fraxtal Hoodi Testnet",
  shortName: "fraxtal-hoodi-testnet",
  chain: "FRAX",
  icon: "fraxtal",
  rpc: ["https://rpc.testnet.frax.com"],
  faucets: ["https://faucet.testnet.frax.com/"],
  nativeCurrency: {
    name: "Frax",
    symbol: "FRAX",
    decimals: 18,
  },
  infoURL: "https://testnet.frax.com",
  chainId: 2523,
  networkId: 2523,
  slip44: 1,
  explorers: [],
  status: "active",
} satisfies Chain
