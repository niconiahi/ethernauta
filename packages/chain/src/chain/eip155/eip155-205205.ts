import type { Chain } from "../shared"

export const eip155_205205 = {
  name: "Auroria Testnet",
  shortName: "auroria",
  title: "Xertra Testnet Auroria",
  chain: "Auroria",
  icon: "auroria",
  rpc: ["https://auroria.rpc.xertra.com"],
  faucets: ["https://auroria.faucet.xertra.com"],
  nativeCurrency: {
    name: "tSTRAX",
    symbol: "tSTRAX",
    decimals: 18,
  },
  infoURL: "https://xertra.com",
  chainId: 205205,
  networkId: 205205,
  explorers: [
    {
      name: "Auroria Testnet Explorer",
      url: "https://auroria.explorer.xertra.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
