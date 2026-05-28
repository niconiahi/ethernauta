import type { Chain } from "../shared"

export const eip155_567 = {
  name: "Validium Network",
  shortName: "validium-testnet",
  chain: "Validium Network Testnet",
  rpc: ["https://testnet.l2.rpc.validium.network"],
  faucets: ["https://testnet.faucet.validium.network"],
  nativeCurrency: {
    name: "Validium",
    symbol: "VLDM",
    decimals: 18,
  },
  infoURL: "https://www.validium.network",
  chainId: 567,
  networkId: 567,
  explorers: [
    {
      name: "Validium Network Testnet Block Explorer",
      url: "https://testnet.explorer.validium.network",
      standard: "none",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://testnet.bridge.validium.network/bridge",
      },
    ],
  },
  status: "active",
} satisfies Chain
