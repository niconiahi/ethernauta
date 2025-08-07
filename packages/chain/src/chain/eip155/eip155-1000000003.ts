// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1000000003 = {
  name: "DeInfra Devnet3",
  shortName: "deinfra-dev3",
  chain: "DeInfraDev3",
  icon: "deinfra",
  rpc: ["https://c3n1.thepower.io/jsonrpc"],
  faucets: ["https://faucet.thepower.io/"],
  nativeCurrency: {
    name: "dev3SK",
    symbol: "dSK",
    decimals: 18,
  },
  infoURL: "https://deinfra.net",
  chainId: 1000000003,
  networkId: 1000000003,
  explorers: [
    {
      name: "Deinfra Devnet Chain 3 Network Explorer",
      url: "https://bs.thepower.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
