/* eslint no-template-curly-in-string: 0 */
export const otp = {
  name: "OriginTrail Parachain",
  shortName: "otp",
  chain: "OTP",
  rpc: [
    "https://astrosat.origintrail.network",
    "wss://parachain-rpc.origin-trail.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "OriginTrail Parachain Token",
    symbol: "OTP",
    decimals: 12,
  },
  infoURL: "https://parachain.origintrail.io",
  chainId: 2043,
  networkId: 2043,
} as const
