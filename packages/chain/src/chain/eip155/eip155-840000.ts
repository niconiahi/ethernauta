// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_840000 = {
  name: "RUNEVM Testnet",
  shortName: "runevm-test",
  chain: "RuneVM",
  rpc: ["https://rpc.runevm.io/"],
  faucets: ["https://faucet.runevm.io/"],
  nativeCurrency: {
    name: "Test Bitcoin",
    symbol: "tBTC",
    decimals: 8,
  },
  infoURL: "",
  chainId: 840000,
  networkId: 840000,
  explorers: [
    {
      name: "Tracehawk",
      url: "https://explorer.runevm.io",
      standard: "none",
    },
  ],
} satisfies Chain
