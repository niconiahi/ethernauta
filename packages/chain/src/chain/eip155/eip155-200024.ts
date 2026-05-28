import type { Chain } from "../shared"

export const eip155_200024 = {
  name: "NitroGraph Testnet",
  shortName: "nitro-testnet",
  chain: "NOS",
  icon: "nitrograph",
  rpc: ["https://rpc-testnet.nitrograph.foundation"],
  faucets: ["https://faucet-testnet.nitrograph.foundation"],
  nativeCurrency: {
    name: "Nitro",
    symbol: "NOS",
    decimals: 18,
  },
  infoURL: "https://docs.nitrograph.com",
  chainId: 200024,
  networkId: 200024,
  slip44: 1,
  explorers: [
    {
      name: "NitroGraphTestnetInfo",
      url: "https://explorer-testnet.nitrograph.foundation",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
