// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3939: Chain = {
  name: "DOS Testnet",
  shortName: "dost",
  chain: "DOS",
  icon: "doschain",
  rpc: ["https://test.doschain.com/"],
  faucets: [],
  nativeCurrency: {
    name: "DOS",
    symbol: "DOS",
    decimals: 18,
  },
  infoURL: "http://doschain.io/",
  chainId: 3939,
  networkId: 3939,
  slip44: 1,
  explorers: [
    {
      name: "DOScan-Test",
      url: "https://test.doscan.io",
      standard: "EIP3091",
    },
  ],
}
