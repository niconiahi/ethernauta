// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_15557 = {
  name: "EOS EVM Network Testnet",
  shortName: "eos-testnet",
  chain: "EOS",
  icon: "eos",
  rpc: ["https://api.testnet.evm.eosnetwork.com"],
  faucets: [],
  nativeCurrency: {
    name: "EOS",
    symbol: "EOS",
    decimals: 18,
  },
  infoURL: "https://eosnetwork.com/eos-evm",
  chainId: 15557,
  networkId: 15557,
  slip44: 1,
  explorers: [
    {
      name: "EOS EVM Explorer",
      url: "https://explorer.testnet.evm.eosnetwork.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
