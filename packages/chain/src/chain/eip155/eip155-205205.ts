// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_205205 = {
  name: "Auroria Testnet",
  shortName: "auroria",
  title: "Stratis Testnet Auroria",
  chain: "Auroria",
  icon: "auroria",
  rpc: ["https://auroria.rpc.stratisevm.com"],
  faucets: ["https://auroria.faucet.stratisevm.com"],
  nativeCurrency: {
    name: "Auroria Stratis",
    symbol: "tSTRAX",
    decimals: 18,
  },
  infoURL: "https://www.stratisplatform.com",
  chainId: 205205,
  networkId: 205205,
  explorers: [
    {
      name: "Auroria Testnet Explorer",
      url: "https://auroria.explorer.stratisevm.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
