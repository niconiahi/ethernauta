import type { Chain } from "../shared"

export const eip155_8004 = {
  name: "ProbeChain Mainnet",
  shortName: "probe",
  chain: "PROBE",
  rpc: ["https://proscan.pro/chain/rydberg-rpc"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Probe",
    symbol: "PROBE",
    decimals: 18,
  },
  infoURL: "https://probechain.org",
  chainId: 8004,
  networkId: 8004,
  explorers: [
    {
      name: "ProScan",
      url: "https://proscan.pro/rydberg",
      standard: "none",
    },
  ],
} satisfies Chain
