// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1555 = {
  name: "Datacore Smart Chain",
  shortName: "DSCs",
  chain: "Datacore Smart Chain",
  icon: "dscscan",
  rpc: ["https://rpc01.dscscan.io"],
  faucets: [],
  nativeCurrency: {
    name: "Datacore Smart Chain",
    symbol: "DSC",
    decimals: 18,
  },
  infoURL: "https://rpc01.dscscan.io",
  chainId: 1555,
  networkId: 1555,
  explorers: [
    {
      name: "Datacore Smart Chain",
      url: "https://dscscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
