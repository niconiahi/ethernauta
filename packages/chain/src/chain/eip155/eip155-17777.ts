// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_17777 = {
  name: "EOS EVM Network",
  shortName: "eos",
  chain: "EOS",
  icon: "eos",
  rpc: ["https://api.evm.eosnetwork.com"],
  faucets: [],
  nativeCurrency: {
    name: "EOS",
    symbol: "EOS",
    decimals: 18,
  },
  infoURL: "https://eosnetwork.com/eos-evm",
  chainId: 17777,
  networkId: 17777,
  explorers: [
    {
      name: "EOS EVM Explorer",
      url: "https://explorer.evm.eosnetwork.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
