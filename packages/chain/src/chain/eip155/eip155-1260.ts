// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1260 = {
  name: "Metacces Testnet",
  shortName: "ACCESt",
  chain: "Metacces Testnet",
  icon: "metacces",
  rpc: ["https://tapi.accesscan.io"],
  faucets: [],
  nativeCurrency: {
    name: "Metacces",
    symbol: "ACCES",
    decimals: 18,
  },
  infoURL: "https://metacces.com",
  chainId: 1260,
  networkId: 1260,
  explorers: [
    {
      name: "accesscan",
      url: "https://testnet.accesscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
