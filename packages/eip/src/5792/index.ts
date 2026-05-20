// https://eips.ethereum.org/EIPS/eip-5792

export {
  type Capabilities,
  capabilitiesSchema,
  type CallsStatus,
  callsStatusSchema,
  type SendCallsCall,
  sendCallsCallSchema,
  type SendCallsParameter,
  sendCallsParameterSchema,
  type SendCallsParameters,
  sendCallsParametersSchema,
} from "./capabilities"
export { wallet_getCallsStatus } from "./method/wallet_getCallsStatus"
export { wallet_getCapabilities } from "./method/wallet_getCapabilities"
export { wallet_sendCalls } from "./method/wallet_sendCalls"
