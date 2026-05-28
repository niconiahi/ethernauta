import type { Chain } from "../shared"

export const eip155_7771777 = {
  name: "VALYGO Smartchain",
  shortName: "vyo",
  chain: "VYO",
  icon: "valygo",
  rpc: [
    "https://rpc-gw-1.vyoscan.com/ext/bc/2t51dXsuxUvd9teY9TKEJmgxmxMk3CRF88UYTA4HQgjeYZqzSX/rpc",
    "https://rpc-gw-2.vyoscan.com/ext/bc/2t51dXsuxUvd9teY9TKEJmgxmxMk3CRF88UYTA4HQgjeYZqzSX/rpc",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "VYO",
    symbol: "VYO",
    decimals: 18,
  },
  infoURL: "https://vyochain.com",
  chainId: 7771777,
  networkId: 7771777,
  explorers: [
    {
      name: "VYOScan",
      url: "https://vyoscan.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-43114",
    bridges: [],
  },
} satisfies Chain
