// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4544 = {
  name: "Emoney Network Testnet",
  shortName: "EmoneyTestnet",
  chain: "Emoney",
  icon: "emoney",
  rpc: ["https://testnet.emoney.network/"],
  faucets: ["https://faucet.emoney.network/faucet"],
  nativeCurrency: {
    name: "Emoney Network",
    symbol: "EMYC",
    decimals: 18,
  },
  infoURL: "https://emoney.network/",
  chainId: 4544,
  networkId: 4544,
  slip44: 118,
  explorers: [
    {
      name: "EMoney Explorer",
      url: "https://explore-stage.emoney.network",
      standard: "none",
    },
  ],
} satisfies Chain
