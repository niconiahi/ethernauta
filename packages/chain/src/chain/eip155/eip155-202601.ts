import type { Chain } from "../shared"

export const eip155_202601 = {
  name: "Ronin Saigon Testnet",
  shortName: "ronin-saigon",
  chain: "ronin",
  icon: "ronin",
  rpc: [
    "https://saigon-testnet.roninchain.com/rpc",
    "https://ronin-saigon.drpc.org",
  ],
  faucets: ["https://faucet.roninchain.com/"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Ronin",
    symbol: "RON",
    decimals: 18,
  },
  infoURL: "https://roninchain.com",
  chainId: 202601,
  networkId: 202601,
  explorers: [
    {
      name: "Ronin Saigon Explorer",
      url: "https://saigon-explorer.roninchain.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://saigon-testnet-cc58e966ql-f24a704b3d708471.testnets.rollbridge.app/",
      },
    ],
  },
} satisfies Chain
