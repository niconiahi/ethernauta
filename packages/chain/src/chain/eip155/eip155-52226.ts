// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_52226 = {
  name: "Cytonic Ethereum Testnet",
  shortName: "CEVM",
  chain: "CytonicEVM",
  icon: "cytonic_l2",
  rpc: ["http://rpc.evm.testnet.cytonic.com"],
  faucets: [],
  nativeCurrency: {
    name: "Cytonic",
    symbol: "CCC",
    decimals: 18,
  },
  infoURL: "https://cytonic.com",
  chainId: 52226,
  networkId: 52226,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.evm.testnet.cytonic.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-52225",
  },
} satisfies Chain
